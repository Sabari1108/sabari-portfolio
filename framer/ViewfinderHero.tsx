// Hero — camera viewfinder: duotone portrait with fluid mouse ripple + colour reveal,
// animated gradient field, REC timecode, audio meter, full-width name.
import * as React from "react"
import * as THREE from "https://esm.sh/three@0.169.0"
import { addPropertyControls, ControlType } from "framer"
import { useFonts, useTheme, u } from "./Shared.tsx"

const CSS = `
.va{position:relative;min-height:100svh;padding:88px clamp(16px,3.2vw,48px) 0;display:flex;flex-direction:column;overflow:hidden}
.va__row{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding:18px 0 22px}
.va__intro{max-width:360px;font-size:15px;line-height:1.5;color:color-mix(in srgb,var(--fg) 78%,transparent)}
.va__intro b{color:var(--fg);font-weight:600}
.va__role{text-align:right}
.va__role .mono{color:var(--mut);display:block;margin-bottom:4px}
.va__word{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(26px,2.6vw,40px);line-height:1.1;height:1.1em;overflow:hidden;display:block}
.va__word i{display:block;line-height:1.1;white-space:nowrap;transition:transform .9s cubic-bezier(.19,1,.22,1)}
/* viewfinder */
.vf.lt .vf__ui{color:#15131c}.vf.lt .vf__c{border-color:rgba(20,18,28,.8)}.vf.lt .vf__t{text-shadow:none}.vf.lt .vf__cross::before,.vf.lt .vf__cross::after{background:#15131c}.vf.lt .thirds{opacity:.5;filter:invert(1)}
.vf{position:relative;flex:1;min-height:360px;max-height:62vh;border-radius:14px;overflow:hidden;background:#050507;isolation:isolate}
.vf canvas{position:absolute;inset:0;width:100%;height:100%}
.vf__ui{position:absolute;inset:0;pointer-events:none;color:#fff;z-index:2}
.vf__c{position:absolute;width:26px;height:26px;border:1.5px solid rgba(255,255,255,.85)}
.vf__c.tl{left:16px;top:16px;border-right:0;border-bottom:0}.vf__c.tr{right:16px;top:16px;border-left:0;border-bottom:0}
.vf__c.bl{left:16px;bottom:16px;border-right:0;border-top:0}.vf__c.br{right:16px;bottom:16px;border-left:0;border-top:0}
.vf__t{position:absolute;display:flex;gap:14px;align-items:center;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 1px 8px rgba(0,0,0,.5)}
.vf__t.tl{left:52px;top:20px}.vf__t.tr{right:52px;top:20px}.vf__t.bl{left:52px;bottom:20px}.vf__t.br{right:52px;bottom:20px}
.rec{display:inline-flex;align-items:center;gap:7px}.rec i{width:8px;height:8px;border-radius:50%;background:#ff3b30;animation:blink 1.2s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.vf__cross{position:absolute;left:50%;top:50%;width:26px;height:26px;transform:translate(-50%,-50%);opacity:.6}
.vf__cross::before,.vf__cross::after{content:'';position:absolute;background:#fff}.vf__cross::before{left:50%;top:0;bottom:0;width:1px}.vf__cross::after{top:50%;left:0;right:0;height:1px}
.meter{position:absolute;right:22px;top:50%;transform:translateY(-50%);display:flex;gap:3px;align-items:flex-end;height:70px}
.meter i{width:3px;background:linear-gradient(to top,#d4ff3a 60%,#ffcc00 80%,#ff3b30);border-radius:2px;height:20%;transition:height .08s}
.thirds{position:absolute;inset:0;background:
 linear-gradient(to right,transparent calc(33.33% - .5px),rgba(255,255,255,.12) 33.33%,transparent calc(33.33% + .5px),transparent calc(66.66% - .5px),rgba(255,255,255,.12) 66.66%,transparent calc(66.66% + .5px)),
 linear-gradient(to bottom,transparent calc(33.33% - .5px),rgba(255,255,255,.12) 33.33%,transparent calc(33.33% + .5px),transparent calc(66.66% - .5px),rgba(255,255,255,.12) 66.66%,transparent calc(66.66% + .5px))}
.va__name{position:relative;z-index:3;font-family:'Inter Tight',sans-serif;font-weight:900;letter-spacing:-.065em;line-height:.74;text-transform:uppercase;white-space:nowrap;margin:.08em 0 0;padding-bottom:74px}
.va__name .ch{display:inline-block;transform:translateY(105%);transition:transform 1.3s cubic-bezier(.19,1,.22,1)}
.va__name.in .ch{transform:none}
.va__name .ch.alt{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-.02em;text-transform:none;color:var(--acc)}
@media(max-width:800px){.va__row{flex-direction:column;align-items:flex-start}.va__role{text-align:left}.vf{max-height:none;flex:none;aspect-ratio:4/5}.vf__t.tr,.vf__t.br,.meter{display:none}.va__name{padding-bottom:90px}}
`
const FRAG = `uniform sampler2D uTex;uniform vec2 uImg,uRes,uM,uV;uniform float uTime,uH,uIn,uLight;uniform vec3 uA,uB,uC,uD,uE;varying vec2 v;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
void main(){
  vec2 asp=vec2(uRes.x/uRes.y,1.);vec2 p=v*asp;
  // flowing background
  float t=uTime*.08;vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6-t+3.1));float f=fbm(p*1.3+q*1.8+t*.5);
  vec3 bg=mix(uA,uB,smoothstep(.25,.85,f));bg=mix(bg,uC,smoothstep(.62,.95,f)*.55);
  // portrait placement: height = 104% of frame, anchored bottom, offset right
  float ih=min(1.04,1.12*(uRes.x/uRes.y)*(uImg.y/uImg.x)), iw=ih*uImg.x/uImg.y*(uRes.y/uRes.x);
  float cx= uRes.x/uRes.y>1.3 ? .6 : .5;
  vec2 d=v-uM;float dl=length(d*asp);
  vec2 push=uV*smoothstep(.3,0.,dl)*uH*.9;
  float rip=sin(dl*40.-uTime*5.)*.006*smoothstep(.35,0.,dl)*uH;
  vec2 uv=vec2((v.x-(cx-iw*.5))/iw,(v.y+.0)/ih);
  uv+= -push + normalize(d+1e-4)*rip;
  uv.y-= (1.-uIn)*.12;
  vec4 im=vec4(0.);
  if(uv.x>0.&&uv.x<1.&&uv.y>0.&&uv.y<1.){float s=length(push)*.25+.0015;
    im.r=texture2D(uTex,uv+vec2(s,0.)).r;im.g=texture2D(uTex,uv).g;im.b=texture2D(uTex,uv-vec2(s,0.)).b;im.a=texture2D(uTex,uv).a;}
  // duotone the portrait, reveal true colour around the cursor
  float g=dot(im.rgb,vec3(.299,.587,.114));g=pow(smoothstep(.0,.85,g),.72);
  vec3 duo=mix(uD,uE,g);
  float reveal=smoothstep(.22,.05,dl)*uH;
  vec3 person=mix(duo,im.rgb,reveal);
  vec3 col=mix(bg,person,im.a*uIn);
  // soft rim light from the background colour
  col+= uC*pow(1.-abs(im.a*2.-1.),6.)*.25*uIn;
  // vignette + scanlines + grain
  col*=1.-(uLight>.5?.25:.55)*pow(length((v-.5)*vec2(1.2,1.)),2.);
  col*=.96+.04*sin(v.y*uRes.y*1.6);
  col+=(h(v*uRes+uTime)-.5)*.06;
  gl_FragColor=vec4(col,1.);}`

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 */
export default function ViewfinderHero(props) {
    useFonts()
    const mode = useTheme()
    const vfRef = React.useRef<HTMLDivElement>(null), cv = React.useRef<HTMLCanvasElement>(null), nm = React.useRef<HTMLHeadingElement>(null)
    const tcRef = React.useRef<HTMLSpanElement>(null), met = React.useRef<HTMLDivElement>(null)
    const U = React.useRef<any>(null)
    const [wi, setWi] = React.useState(0)
    const [inn, setIn] = React.useState(false)
    const words = props.roles.split(",").map((s: string) => s.trim())
    const name = props.name as string
    React.useEffect(() => { const iv = setInterval(() => setWi((w) => (w + 1) % words.length), 2400); return () => clearInterval(iv) }, [words.length])
    // fit name to width
    React.useEffect(() => {
        const el = nm.current!
        const fit = () => { el.style.fontSize = "100px"; const r = document.createRange(); r.selectNodeContents(el); const w = r.getBoundingClientRect().width; el.style.fontSize = (100 * el.clientWidth / w * 0.995) + "px" }
        fit(); const ro = new ResizeObserver(fit); ro.observe(el.parentElement!)
        document.fonts?.load('900 100px "Inter Tight"').then(fit); const t = setTimeout(() => { fit(); setIn(true) }, 600)
        return () => { ro.disconnect(); clearTimeout(t) }
    }, [name])
    // timecode + meter
    React.useEffect(() => {
        const t0 = performance.now(), pad = (n: number) => String(n).padStart(2, "0")
        const iv = setInterval(() => {
            const s = (performance.now() - t0) / 1000
            if (tcRef.current) tcRef.current.textContent = `00:${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}:${pad(Math.floor((s % 1) * 25))}`
            met.current?.querySelectorAll("i").forEach((b: any, i) => (b.style.height = 15 + Math.random() * 80 * (1 - Math.abs(i - 4.5) / 8) + "%"))
        }, 40)
        return () => clearInterval(iv)
    }, [])
    // WebGL
    React.useEffect(() => {
        const vf = vfRef.current!, canvas = cv.current!
        const touch = matchMedia("(hover:none)").matches
        const R = new THREE.WebGLRenderer({ canvas, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 2))
        const sc = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        const Un: any = { uTex: { value: null }, uImg: { value: new THREE.Vector2(1, 1) }, uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uM: { value: new THREE.Vector2(0.5, 0.5) }, uV: { value: new THREE.Vector2() }, uH: { value: 0 }, uIn: { value: 0 },
            uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() }, uD: { value: new THREE.Color() }, uE: { value: new THREE.Color() }, uLight: { value: 0 } }
        U.current = Un
        sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: Un, vertexShader: "varying vec2 v;void main(){v=uv;gl_Position=vec4(position,1.);}", fragmentShader: FRAG })))
        const ld = new THREE.TextureLoader(); ld.setCrossOrigin("anonymous")
        let t0 = -1
        ld.load(u(props.photo), (tex: any) => { tex.colorSpace = THREE.SRGBColorSpace; Un.uTex.value = tex; Un.uImg.value.set(tex.image.width, tex.image.height); t0 = performance.now() })
        const size = () => { const w = vf.clientWidth, h = vf.clientHeight; R.setSize(w, h, false); Un.uRes.value.set(w, h) }
        const ro = new ResizeObserver(size); ro.observe(vf); size()
        const m = new THREE.Vector2(0.5, 0.5); let hov = 0
        const mv = (e: PointerEvent) => { const r = vf.getBoundingClientRect(); m.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height) }
        const en = () => (hov = 1), lv = () => (hov = 0)
        vf.addEventListener("pointermove", mv); vf.addEventListener("pointerenter", en); vf.addEventListener("pointerleave", lv)
        let visible = true; const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(vf)
        const clk = new THREE.Clock(); let raf = 0
        const loop = () => {
            raf = requestAnimationFrame(loop); if (!visible || !Un.uTex.value) return
            const t = clk.getElapsedTime(); Un.uTime.value = t
            Un.uIn.value = Math.min(1, (performance.now() - t0) / 1600)
            if (touch) { const k = t * 0.35; m.set(0.5 + 0.28 * Math.sin(k * 1.3), 0.5 + 0.22 * Math.sin(k * 1.9)); hov = 0.55 }
            const cur = Un.uM.value, nx = cur.clone().lerp(m, 0.1); Un.uV.value.lerp(nx.clone().sub(cur), 0.25); cur.copy(nx)
            Un.uH.value += (hov - Un.uH.value) * 0.06
            R.render(sc, cam)
        }
        loop()
        return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); R.dispose() }
    }, [props.photo])
    // theme colours
    React.useEffect(() => {
        const Un = U.current; if (!Un) return
        const l = mode === "light"; Un.uLight.value = l ? 1 : 0
        const set = (k: string, c: string) => Un[k].value.set(c)
        if (l) { set("uA", "#e9e3d8"); set("uB", "#cfc6f6"); set("uC", "#ff8a4c"); set("uD", "#1b1640"); set("uE", "#fff6ea") }
        else { set("uA", "#06050b"); set("uB", "#3a1f96"); set("uC", "#d4ff3a"); set("uD", "#0b0816"); set("uE", "#f3eeff") }
    }, [mode])
    const chars = [...name].map((c, i) => (
        <span key={i} className={"ch" + (i === props.accent ? " alt" : "")} style={{ transitionDelay: `${0.2 + i * 0.04}s` }}>
            {c === " " ? <span style={{ display: "inline-block", width: ".28em" }} /> : c}
        </span>
    ))
    return (
        <section className="va" style={{ width: "100%", height: "100%", minHeight: 640, background: "var(--bg)", color: "var(--fg)", fontFamily: "'Manrope',sans-serif", boxSizing: "border-box" }}>
            <style>{CSS + `.va *{box-sizing:border-box}.va p,.va h1{margin:0}`}</style>
            <div className="va__row">
                <p className="va__intro"><b>{props.lead}</b> {props.intro}</p>
                <div className="va__role"><span className="mono" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" }}>{props.rolesLabel}</span>
                    <span className="va__word">{words.map((w: string) => <i key={w} style={{ transform: `translateY(${-wi * 100}%)` }}>{w}</i>)}</span></div>
            </div>
            <div className={"vf" + (mode === "light" ? " lt" : "")} ref={vfRef} data-cursor="Hover">
                <canvas ref={cv} />
                <div className="vf__ui">
                    <div className="thirds" />
                    <span className="vf__c tl" /><span className="vf__c tr" /><span className="vf__c bl" /><span className="vf__c br" />
                    <span className="vf__t tl"><span className="rec"><i />Rec</span><span ref={tcRef}>00:00:00:00</span></span>
                    <span className="vf__t tr"><span>4K · 25fps</span><span>ISO 800</span><span>f/1.8</span></span>
                    <span className="vf__t bl"><span>{props.file}</span></span>
                    <span className="vf__t br"><span>▮▮▮▯ 76%</span></span>
                    <span className="vf__cross" />
                    <div className="meter" ref={met}>{Array.from({ length: 10 }).map((_, i) => <i key={i} />)}</div>
                </div>
            </div>
            <h1 ref={nm} className={"va__name" + (inn ? " in" : "")} aria-label={name}>{chars}</h1>
        </section>
    )
}
ViewfinderHero.defaultProps = {
    name: "Sabari Logesh", accent: 7,
    lead: "Graphic designer & video editor",
    intro: "from Bangalore. I cut, animate and design campaigns, reels and AI films that make people stop scrolling.",
    rolesLabel: "Currently rolling as", roles: "a Motion Designer, a Video Editor, an AI Filmmaker, a Campaign Designer",
    photo: "assets/img/me/side-color.webp", file: "SABARI_LOGESH_REEL_V26.MOV",
}
addPropertyControls(ViewfinderHero, {
    name: { type: ControlType.String, title: "Name" },
    accent: { type: ControlType.Number, title: "Italic letter #", min: -1, max: 20, step: 1 },
    lead: { type: ControlType.String, title: "Lead (bold)" },
    intro: { type: ControlType.String, title: "Intro", displayTextArea: true },
    rolesLabel: { type: ControlType.String, title: "Roles label" },
    roles: { type: ControlType.String, title: "Roles (comma)" },
    photo: { type: ControlType.String, title: "Photo path/URL" },
    file: { type: ControlType.String, title: "File label" },
})
