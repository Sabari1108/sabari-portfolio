// Selected Work — WebGL 3D roll carousel. Curved cards on a cylinder, drag/scroll to spin,
// hover bulge + RGB split, click to open the shared project modal.
import * as React from "react"
import * as THREE from "https://esm.sh/three@0.169.0"
import { addPropertyControls, ControlType } from "framer"
import { PROJECTS, u, openProject, ProjectModal, mouse, useFonts, ACC, FONT_D, FONT_M } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 800
 */
export default function WorkRoll3D(props) {
    useFonts()
    const wrap = React.useRef<HTMLDivElement>(null)
    const cv = React.useRef<HTMLCanvasElement>(null)
    const [active, setActive] = React.useState(0)
    const [hover, setHover] = React.useState(false)

    React.useEffect(() => {
        const el = wrap.current!, canvas = cv.current!
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia('(hover:none)').matches ? 1.5 : 1.75))
        const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100), group = new THREE.Group()
        scene.add(group)
        const n = PROJECTS.length, W = 2.3, H = 3.0, GAP = 0.42
        const R = (n * (W + GAP)) / (Math.PI * 2), step = (Math.PI * 2) / n
        const loader = new THREE.TextureLoader(); loader.setCrossOrigin("anonymous")
        const vert = `uniform float uR, uVel, uHover; varying vec2 vUv; varying float vDepth;
      void main(){ vUv = uv; vec3 p = position; float th = p.x/uR;
        vec3 c = vec3(sin(th)*uR, p.y, cos(th)*uR);
        c.z += sin(uv.y*3.14159)*uVel*.35; c.y += sin(uv.x*3.14159)*uVel*.08;
        c += normalize(vec3(c.x,0.,c.z))*sin(uv.x*3.14159)*sin(uv.y*3.14159)*uHover*.18;
        vec4 world = modelMatrix*vec4(c,1.); vDepth = world.z; gl_Position = projectionMatrix*viewMatrix*world; }`
        const frag = `uniform sampler2D uTex; uniform vec2 uImg, uPlane; uniform float uHover, uVel, uReady, uR; uniform vec3 uBg; varying vec2 vUv; varying float vDepth;
      void main(){
        vec2 ratio = vec2(min((uPlane.x/uPlane.y)/(uImg.x/uImg.y),1.), min((uPlane.y/uPlane.x)/(uImg.y/uImg.x),1.));
        vec2 uv = vec2(vUv.x*ratio.x+(1.-ratio.x)*.5, vUv.y*ratio.y+(1.-ratio.y)*.5);
        uv = (uv-.5)*(1.-uHover*.08)+.5;
        float s = abs(uVel)*.008 + uHover*.003;
        vec3 col = vec3(texture2D(uTex, uv+vec2(s,0.)).r, texture2D(uTex, uv).g, texture2D(uTex, uv-vec2(s,0.)).b);
        col = mix(uBg, col, mix(.12, 1., smoothstep(-uR, uR, vDepth)));
        col = mix(uBg, col, uReady);
        vec2 q = abs(vUv-.5)*uPlane; vec2 hb = uPlane*.5-.08;
        if(length(max(q-hb,0.))-.08>0.) discard;
        gl_FragColor = vec4(col,1.); }`
        const meshes: any[] = []
        PROJECTS.forEach((p, i) => {
            const mat = new THREE.ShaderMaterial({ side: THREE.DoubleSide, vertexShader: vert, fragmentShader: frag,
                uniforms: { uTex: { value: null }, uImg: { value: new THREE.Vector2(1, 1) }, uPlane: { value: new THREE.Vector2(W, H) }, uR: { value: R }, uVel: { value: 0 }, uHover: { value: 0 }, uReady: { value: 0 }, uBg: { value: new THREE.Color() } } })
            const m = new THREE.Mesh(new THREE.PlaneGeometry(W, H, 48, 32), mat)
            m.rotation.y = i * step; m.userData.i = i
            group.add(m); meshes.push(m)
            loader.load(u(p.texture), (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace
                mat.uniforms.uTex.value = tex; mat.uniforms.uImg.value.set(tex.image.width, tex.image.height)
                const t0 = performance.now()
                const fade = () => { const k = Math.min((performance.now() - t0) / 900, 1); mat.uniforms.uReady.value = k; if (k < 1) requestAnimationFrame(fade) }
                fade()
            })
        })
        const setBg = () => { const c = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#08080a'; meshes.forEach((m) => m.material.uniforms.uBg.value.set(c)) }
        setBg(); addEventListener('themechange', setBg)
        const st = { target: 0, cur: 0, vel: 0, drag: false, lastX: 0, moved: 0 }
        const size = () => {
            const w = el.clientWidth, h = el.clientHeight
            renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1)
            camera.position.set(0, 0.2, w < 700 ? R + 6.8 : R + 7.2); camera.lookAt(0, -0.45, 0); camera.updateProjectionMatrix()
        }
        const ro = new ResizeObserver(size); ro.observe(el); size()
        const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
        let hovered = -1
        const down = (e: PointerEvent) => { st.drag = true; st.lastX = e.clientX; st.moved = 0 }
        const up = () => (st.drag = false)
        const move = (e: PointerEvent) => {
            if (st.drag) { const dx = e.clientX - st.lastX; st.lastX = e.clientX; st.moved += Math.abs(dx); st.target += dx * 0.006 }
            const r = canvas.getBoundingClientRect()
            ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
            ray.setFromCamera(ndc, camera)
            const hit = ray.intersectObjects(meshes)[0]
            hovered = hit && hit.point.z > 0 ? hit.object.userData.i : -1
            el.style.cursor = st.drag ? "grabbing" : hovered >= 0 ? "pointer" : "grab"
        }
        const norm = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
        let act = 0
        const click = () => {
            if (st.moved > 6) return
            const i = hovered >= 0 ? hovered : act
            const a = norm(-i * step - st.cur)
            if (Math.abs(a) > step * 0.5) st.target += a
            else openProject(i)
        }
        el.addEventListener("pointerdown", down); addEventListener("pointerup", up); addEventListener("pointermove", move); el.addEventListener("click", click)
        let lastY = scrollY, visible = false, raf = 0, idle = 0
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el)
        const loop = () => {
            raf = requestAnimationFrame(loop)
            const dy = scrollY - lastY; lastY = scrollY
            if (!visible) return
            st.target -= Math.max(-40, Math.min(40, dy)) * 0.0022
            idle = Math.abs(st.target - st.cur) < 0.002 && !st.drag ? idle + 1 : 0
            if (idle > 70) st.target += (Math.round(st.target / step) * step - st.target) * 0.06
            const prev = st.cur
            st.cur += (st.target - st.cur) * 0.075
            st.vel += (Math.max(-1, Math.min(1, (st.cur - prev) * 8)) - st.vel) * 0.1
            group.rotation.set(0.06 + mouse.ny * 0.04, st.cur, mouse.nx * 0.02)
            meshes.forEach((m) => { const U = m.material.uniforms; U.uVel.value = st.vel; U.uHover.value += ((m.userData.i === hovered ? 1 : 0) - U.uHover.value) * 0.1 })
            const a = Math.round((((-st.cur / step) % n) + n) % n) % n
            if (a !== act) { act = a; setActive(a) }
            renderer.render(scene, camera)
        }
        loop()
        return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("pointerup", up); removeEventListener("pointermove", move); renderer.dispose() }
    }, [])

    const p = PROJECTS[active]
    return (
        <div ref={wrap} style={{ position: "relative", width: "100%", height: "100%", minHeight: 460, background: "var(--bg)", color: "var(--fg)", touchAction: "pan-y", cursor: "grab", userSelect: "none" }}>
            <canvas ref={cv} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            <div key={active} style={{ position: "absolute", left: "clamp(16px,3.2vw,48px)", bottom: 28, pointerEvents: "none", animation: "slIn .6s cubic-bezier(.19,1,.22,1)" }}>
                <style>{`@keyframes slIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
                <div style={{ fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", color: ACC }}>{String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</div>
                <div style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: "clamp(28px,4vw,58px)", letterSpacing: "-.03em", lineHeight: 1, margin: "8px 0" }}>{p.title}</div>
                <div style={{ fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--mut)" }}>{p.client}</div>
            </div>
            <div style={{ position: "absolute", right: "clamp(16px,3.2vw,48px)", bottom: 34, fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--mut)" }}>
                <span style={{ color: "var(--fg)" }}>{props.hint}</span>
            </div>
            <ProjectModal />
        </div>
    )
}
WorkRoll3D.defaultProps = { hint: "Drag or scroll · Click to open" }
addPropertyControls(WorkRoll3D, { hint: { type: ControlType.String, title: "Hint" } })
