// Project Index — list with cursor-following, clip-revealed image preview.
import * as React from "react"
import { PROJECTS, u, openProject, ProjectModal, useFonts, FONT_D, FONT_M } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 */
export default function ProjectIndex() {
    useFonts()
    const prev = React.useRef<HTMLDivElement>(null)
    const [hov, setHov] = React.useState(-1)
    const [imgs, setImgs] = React.useState<{ k: number; src: string }[]>([])
    const on = hov >= 0
    React.useEffect(() => {
        const cur = { x: 0, y: 0, r: 0 }, tgt = { x: 0, y: 0 }
        const mv = (e: PointerEvent) => { tgt.x = e.clientX; tgt.y = e.clientY }
        addEventListener("pointermove", mv)
        let raf = 0
        const loop = () => {
            raf = requestAnimationFrame(loop)
            const dx = tgt.x - cur.x
            cur.x += dx * 0.12; cur.y += (tgt.y - cur.y) * 0.12
            cur.r += (Math.max(-15, Math.min(15, dx * 0.08)) - cur.r) * 0.1
            if (prev.current) prev.current.style.transform = `translate(${cur.x}px,${cur.y}px) translate(-50%,-50%) rotate(${cur.r}deg)`
        }
        loop()
        return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", mv) }
    }, [])
    const enter = (i: number) => { setHov(i); setImgs((a) => [...a.slice(-2), { k: Date.now(), src: u(PROJECTS[i].cover) }]) }
    return (
        <div style={{ width: "100%", background: "var(--bg)", color: "var(--fg)", padding: "0 clamp(16px,3.2vw,48px)", boxSizing: "border-box" }} onPointerLeave={() => setHov(-1)}>
            <style>{`@keyframes slClip{from{clip-path:inset(100% 0 0 0);transform:scale(1.3)}to{clip-path:inset(0 0 0 0);transform:scale(1)}}
            .sl-row{position:relative;overflow:hidden;display:grid;grid-template-columns:60px 1.4fr 1fr 1fr 40px;gap:20px;align-items:center;padding:26px 0;border-bottom:1px solid var(--line);cursor:pointer}
            .sl-row::before{content:'';position:absolute;inset:0;background:var(--fg);transform:scaleY(0);transform-origin:bottom;transition:transform .6s cubic-bezier(.19,1,.22,1)}
            .sl-row>*{position:relative;transition:color .4s,transform .6s cubic-bezier(.19,1,.22,1)}
            .sl-row:hover::before{transform:scaleY(1)} .sl-row:hover>*{color:#08080a!important} .sl-row:hover .sl-t{transform:translateX(18px)}
            @media(max-width:900px){.sl-row{grid-template-columns:40px 1fr 30px}.sl-hide{display:none}}`}</style>
            <div style={{ borderTop: "1px solid var(--line)" }}>
                {PROJECTS.map((p, i) => (
                    <div key={p.id} className="sl-row" onPointerEnter={() => enter(i)} onClick={() => openProject(i)}>
                        <span style={{ fontFamily: FONT_M, fontSize: 11, color: "var(--mut)" }}>{String(i + 1).padStart(2, "0")}</span>
                        <span className="sl-t" style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: "clamp(22px,2.6vw,40px)", letterSpacing: "-.03em", lineHeight: 1 }}>{p.title}</span>
                        <span className="sl-hide" style={{ fontFamily: FONT_M, fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--mut)" }}>{p.client}</span>
                        <span className="sl-hide" style={{ fontFamily: FONT_M, fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--mut)" }}>{p.cat}</span>
                        <span style={{ fontSize: 22, textAlign: "right" }}>↗</span>
                    </div>
                ))}
            </div>
            <div ref={prev} style={{ position: "fixed", left: 0, top: 0, width: 300, height: 380, borderRadius: 14, overflow: "hidden", pointerEvents: "none", zIndex: 50,
                opacity: on ? 1 : 0, scale: on ? "1" : ".6", transition: "opacity .4s, scale .5s cubic-bezier(.19,1,.22,1)" } as any}>
                {imgs.map((m) => <img key={m.k} src={m.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "slClip .7s cubic-bezier(.19,1,.22,1)" }} />)}
            </div>
            <ProjectModal />
        </div>
    )
}
