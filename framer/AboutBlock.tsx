// About — scroll-scrubbed word reveal, 3D tilt card with live IST clock, experience list and toolkit.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { EXPERIENCE, TOOLS, useFonts, ACC, FONT_D, FONT_M, FONT_B, u } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 */
export default function AboutBlock(props) {
    useFonts()
    const p = React.useRef<HTMLParagraphElement>(null)
    const card = React.useRef<HTMLDivElement>(null)
    const [time, setTime] = React.useState("")
    const words = props.text.split(" ")
    React.useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false }) + " IST — Bangalore")
        tick(); const iv = setInterval(tick, 1000)
        let raf = 0
        const loop = () => {
            raf = requestAnimationFrame(loop)
            const el = p.current; if (!el) return
            const r = el.getBoundingClientRect()
            const prog = Math.min(Math.max((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.35), 0), 1)
            const spans = el.children
            for (let i = 0; i < spans.length; i++) (spans[i] as HTMLElement).style.opacity = i / spans.length < prog ? "1" : ".14"
        }
        loop()
        return () => { clearInterval(iv); cancelAnimationFrame(raf) }
    }, [])
    const mono = { fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "var(--mut)" }
    return (
        <div style={{ width: "100%", background: "var(--bg)", color: "var(--fg)", padding: "0 clamp(16px,3.2vw,48px) 40px", boxSizing: "border-box", fontFamily: FONT_B }}>
            <style>{`.sl-ag{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(24px,5vw,80px);margin-top:110px}
            .sl-tools{display:grid;grid-template-columns:repeat(8,1fr);gap:12px}
            .sl-tool{aspect-ratio:1;border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column;justify-content:space-between;padding:14px;transition:all .5s cubic-bezier(.19,1,.22,1)}
            .sl-ph img{filter:grayscale(1) contrast(1.08);transition:filter .8s,transform 1.2s cubic-bezier(.19,1,.22,1)}.sl-ph:hover img{filter:none;transform:scale(1.04)}
            .sl-tool:hover{background:var(--acc);color:var(--acc-ink);transform:translateY(-6px) rotate(-2deg)}
            .sl-exp{display:grid;grid-template-columns:130px 1fr;gap:18px;padding:22px 0;border-bottom:1px solid var(--line)}
            @media(max-width:900px){.sl-ag{grid-template-columns:1fr}.sl-tools{grid-template-columns:repeat(4,1fr)}.sl-exp{grid-template-columns:1fr;gap:6px}}`}</style>
            <p ref={p} style={{ margin: 0, fontFamily: FONT_D, fontWeight: 500, fontSize: "clamp(26px,3.8vw,58px)", lineHeight: 1.12, letterSpacing: "-.025em", maxWidth: 1400 }}>
                {words.map((w: string, i: number) => <span key={i} style={{ opacity: 0.14, transition: "opacity .2s" }}>{w} </span>)}
            </p>
            <div className="sl-ag">
                <div ref={card}
                    onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.transform = `perspective(900px) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 16}deg) rotateX(${-((e.clientY - r.top) / r.height - 0.5) * 16}deg)` }}
                    onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
                    style={{ position: "relative", borderRadius: 22, aspectRatio: "4/5", overflow: "hidden", transition: "transform .4s cubic-bezier(.19,1,.22,1)", transformStyle: "preserve-3d",
                        background: "var(--bg2)" }} className="sl-ph">
                    <img src={u(props.photo)} alt="Sabari Logesh" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.78),transparent 55%)" }} />
                    <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, display: "grid", gap: 4, transform: "translateZ(60px)", color: "#f1ede6" }}>
                        <span style={{ ...mono, color: "rgba(241,237,230,.7)" }}>Based in</span><strong style={{ fontFamily: FONT_D, fontSize: "clamp(22px,2.2vw,32px)", marginBottom: 12 }}>Bangalore</strong>
                        <span style={{ ...mono, color: "rgba(241,237,230,.7)" }}>Working across</span><strong style={{ fontFamily: FONT_D, fontSize: "clamp(22px,2.2vw,32px)", marginBottom: 12 }}>Design · Motion · Edit</strong>
                        <span style={{ ...mono, color: ACC, fontSize: 13 }}>{time}</span>
                    </div>
                </div>
                <div>
                    <div style={{ ...mono, marginBottom: 18 }}>Experience & Education</div>
                    <div style={{ borderTop: "1px solid var(--line)" }}>
                        {EXPERIENCE.map((e) => (
                            <div key={e.role + e.org} className="sl-exp">
                                <span style={{ ...mono, paddingTop: 5 }}>{e.when}</span>
                                <div><strong style={{ display: "block", fontFamily: FONT_D, fontSize: 22, lineHeight: 1.2 }}>{e.role}</strong>
                                    <em style={{ fontStyle: "normal", color: ACC, fontSize: 14 }}>{e.org}</em>
                                    <p style={{ color: "var(--txt2)", fontSize: 15, margin: "6px 0 0" }}>{e.note}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ ...mono, margin: "90px 0 18px" }}>Toolkit</div>
            <div className="sl-tools">
                {TOOLS.map(([a, b]) => <div key={b} className="sl-tool"><b style={{ fontFamily: FONT_D, fontSize: "clamp(26px,2.6vw,40px)", fontWeight: 800, letterSpacing: "-.04em" }}>{a}</b><span style={{ ...mono, color: "inherit", opacity: 0.7 }}>{b}</span></div>)}
            </div>
        </div>
    )
}
AboutBlock.defaultProps = {
    photo: "assets/img/me/front-photo.webp",
    text: "I’m a Graphic Designer and Video Editor with hands-on experience in VFX editing. I love motion graphics and CGI, and bringing concepts to life through dynamic visuals and creative storytelling, whether it’s a hospital, an interiors brand or a devotional AI film.",
}
addPropertyControls(AboutBlock, { photo: { type: ControlType.String, title: "Photo path/URL" }, text: { type: ControlType.String, title: "Bio", displayTextArea: true } })
