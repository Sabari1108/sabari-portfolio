// Contact — giant type with a cursor spotlight that reveals a second message, glow pill button, links.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { useFonts, ACC, FONT_D, FONT_M, FONT_B, u } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 */
export default function ContactReveal(props) {
    useFonts()
    const box = React.useRef<HTMLDivElement>(null)
    const mask = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        const s = { x: 0, y: 0, r: 0, tr: 0 }, c = { x: 0, y: 0 }
        const el = box.current!
        const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); s.x = e.clientX - r.left; s.y = e.clientY - r.top }
        const en = () => (s.tr = 190), lv = () => (s.tr = 0)
        el.addEventListener("pointermove", mv); el.addEventListener("pointerenter", en); el.addEventListener("pointerleave", lv)
        let raf = 0
        const loop = () => {
            raf = requestAnimationFrame(loop)
            c.x += (s.x - c.x) * 0.15; c.y += (s.y - c.y) * 0.15; s.r += (s.tr - s.r) * 0.12
            const m = `radial-gradient(circle ${s.r}px at ${c.x}px ${c.y}px, #000 99%, transparent 100%)`
            if (mask.current) { mask.current.style.maskImage = m; (mask.current.style as any).webkitMaskImage = m }
        }
        loop()
        return () => cancelAnimationFrame(raf)
    }, [])
    const big = { margin: 0, fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(56px,11vw,200px)", lineHeight: 0.88, letterSpacing: "-.055em", textTransform: "uppercase" as const, whiteSpace: "pre-line" as const }
    const mono = { fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" as const }
    return (
        <div style={{ width: "100%", background: "var(--bg)", color: "var(--fg)", padding: "140px clamp(16px,3.2vw,48px) 28px", boxSizing: "border-box", borderTop: "1px solid var(--line)", fontFamily: FONT_B }}>
            <style>{`@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}@keyframes slRot{to{--a:360deg}}
            .sl-glow{position:relative;display:inline-flex;align-items:center;gap:18px;padding:22px 34px;border-radius:99px;color:var(--bg);font-weight:600;font-size:clamp(15px,1.4vw,20px);isolation:isolate;overflow:hidden;text-decoration:none}
            .sl-glow::before{content:'';position:absolute;inset:-2px;border-radius:inherit;background:conic-gradient(from var(--a),var(--acc),#ff5a1f,#7c3aed,var(--acc));z-index:-2;animation:slRot 4s linear infinite}
            .sl-glow::after{content:'';position:absolute;inset:2px;border-radius:inherit;background:var(--fg);z-index:-1;transition:background .4s}
            .sl-glow:hover::after{background:var(--acc)}.sl-glow:hover{color:var(--acc-ink)} .sl-glow i{font-style:normal;transition:transform .5s} .sl-glow:hover i{transform:translateX(6px) rotate(-45deg)}
            .sl-l{color:var(--fg);text-decoration:none;border-bottom:1px solid transparent;transition:border-color .3s}.sl-l:hover{border-color:var(--fg)}`}</style>
            <div ref={box} style={{ position: "relative" }}>
                <h2 style={big}>{props.line}</h2>
                <div ref={mask} aria-hidden style={{ position: "absolute", inset: 0, background: "var(--bg)", color: ACC, pointerEvents: "none", maskImage: "radial-gradient(circle 0px at 0 0,#000,transparent)" } as any}>
                    <h2 style={big}>{props.hidden}</h2>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap", marginTop: 70 }}>
                <a className="sl-glow" href={`mailto:${props.email}`}><span>{props.email}</span><i>→</i></a>
                <div style={{ ...mono, display: "flex", gap: 26, flexWrap: "wrap" }}>
                    <a className="sl-l" href="https://www.behance.net/sabarilogesh" target="_blank">Behance ↗</a>
                    <a className="sl-l" href="https://linkedin.com/in/sabari-logesh-8b44a31a7/" target="_blank">LinkedIn ↗</a>
                    <a className="sl-l" href="tel:+919944538700">+91 99445 38700</a>
                    <a className="sl-l" href={u("assets/sabari-logesh-resume.pdf")} target="_blank">Résumé (PDF) ↗</a>
                </div>
            </div>
            <div style={{ ...mono, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 120, paddingTop: 22, borderTop: "1px solid var(--line)", color: "var(--mut)" }}>
                <span>© 2026 Sabari Logesh A</span><span>Made in Framer · Three.js</span><span>Bangalore, India</span>
            </div>
        </div>
    )
}
ContactReveal.defaultProps = { line: "Let’s make\nsomething\nmove.", hidden: "Say hello\n& start a\nproject ✳", email: "sabarilogesh11@gmail.com" }
addPropertyControls(ContactReveal, {
    line: { type: ControlType.String, title: "Headline", displayTextArea: true },
    hidden: { type: ControlType.String, title: "Reveal text", displayTextArea: true },
    email: { type: ControlType.String, title: "Email" },
})
