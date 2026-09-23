// Small building blocks: section heading, velocity marquee, and the scroll-expanding showreel.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { useFonts, u, ACC, FONT_D, FONT_M, FONT_S } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 */
export function SectionHead(props) {
    useFonts()
    const ref = React.useRef<HTMLHeadingElement>(null)
    const [seen, setSeen] = React.useState(false)
    React.useEffect(() => {
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 })
        io.observe(ref.current!); return () => io.disconnect()
    }, [])
    const chars = (s: string, off: number, outline?: boolean) => [...s].map((c, i) => (
        <span key={i} style={{ display: "inline-block", transform: seen ? "none" : "translateY(110%) rotate(8deg)", opacity: seen ? 1 : 0,
            transition: `all 1.1s cubic-bezier(.19,1,.22,1) ${(off + i) * 0.025}s`, ...(outline ? { fontFamily: FONT_S, fontStyle: "italic", fontWeight: 400, textTransform: "none", letterSpacing: "-.02em", color: "var(--acc)" } : {}) }}>{c === " " ? " " : c}</span>))
    const mono = { fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "var(--mut)" }
    return (
        <div id={props.anchor || undefined} style={{ width: "100%", background: "var(--bg)", color: "var(--fg)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, padding: "140px clamp(16px,3.2vw,48px) 48px", boxSizing: "border-box" }}>
            <span style={mono}>( {props.num} )</span>
            <h2 ref={ref} style={{ margin: 0, fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(44px,8vw,130px)", letterSpacing: "-.05em", lineHeight: 0.9, textTransform: "uppercase", overflow: "hidden", paddingBottom: ".05em" }}>
                {chars(props.word1, 0)}{chars(" ", props.word1.length)}{chars(props.word2, props.word1.length + 1, true)}
            </h2>
            <span style={{ ...mono, textAlign: "right" }}>{props.note}</span>
        </div>
    )
}
SectionHead.defaultProps = { num: "01", word1: "Selected", word2: "Work", note: "10 Projects", anchor: "work" }
addPropertyControls(SectionHead, {
    num: { type: ControlType.String }, word1: { type: ControlType.String, title: "Solid word" }, word2: { type: ControlType.String, title: "Outline word" },
    note: { type: ControlType.String }, anchor: { type: ControlType.String, title: "Anchor id" },
})

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 */
export function VelocityMarquee(props) {
    useFonts()
    const tr = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        let x = 0, dir = -1, lastY = scrollY, v = 0, raf = 0
        const loop = () => {
            raf = requestAnimationFrame(loop)
            const dy = scrollY - lastY; lastY = scrollY
            if (dy) dir = dy > 0 ? -1 : 1
            v += (Math.abs(dy) - v) * 0.1
            x += dir * (0.6 + v * 0.25)
            const el = tr.current; if (!el) return
            const w = el.scrollWidth / 2
            if (x < -w) x += w; if (x > 0) x -= w
            el.style.transform = `translateX(${x}px) skewX(${Math.max(-10, Math.min(10, -dy * 0.4))}deg)`
        }
        loop(); return () => cancelAnimationFrame(raf)
    }, [])
    const items = props.items.split(",").map((s: string) => s.trim())
    const row = items.flatMap((t: string, i: number) => [
        <span key={"t" + i} style={i % 2 ? { WebkitTextStroke: "1px var(--fg)", color: "transparent" } : {}}>{t}</span>, <b key={"b" + i} style={{ color: ACC, fontWeight: 400 }}>✦</b>])
    return (
        <div style={{ width: "100%", overflow: "hidden", background: "var(--bg)", color: "var(--fg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "22px 0" }}>
            <div ref={tr} style={{ display: "flex", gap: 40, whiteSpace: "nowrap", width: "max-content", fontFamily: FONT_D, fontWeight: 700, fontSize: "clamp(28px,4.2vw,64px)", letterSpacing: "-.03em", textTransform: "uppercase" }}>
                {row}{row.map((r: any, i: number) => React.cloneElement(r, { key: "c" + i }))}
            </div>
        </div>
    )
}
VelocityMarquee.defaultProps = { items: "Motion Graphics, Video Editing, AI Films, Brand Campaigns, Social Content, VFX" }
addPropertyControls(VelocityMarquee, { items: { type: ControlType.String, title: "Items (comma)" } })

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 1800
 */
export function ShowreelExpand(props) {
    useFonts()
    const sec = React.useRef<HTMLDivElement>(null), frame = React.useRef<HTMLDivElement>(null), vid = React.useRef<HTMLVideoElement>(null)
    const a = React.useRef<HTMLSpanElement>(null), b = React.useRef<HTMLSpanElement>(null)
    React.useEffect(() => {
        let raf = 0, cur = 0
        const loop = () => {
            raf = requestAnimationFrame(loop)
            const r = sec.current!.getBoundingClientRect()
            const p = Math.min(Math.max(-r.top / Math.max(r.height - innerHeight, 1), 0), 1)
            cur += (p - cur) * 0.12
            const w0 = innerWidth < 900 ? 70 : 34
            if (frame.current) { frame.current.style.width = w0 + (100 - w0) * cur + "vw"; frame.current.style.borderRadius = 18 * (1 - cur) + "px" }
            if (a.current) { a.current.style.transform = `translateX(${-60 * cur}%)`; a.current.style.opacity = String(1 - cur) }
            if (b.current) { b.current.style.transform = `translateX(${60 * cur}%)`; b.current.style.opacity = String(1 - cur) }
            const v = vid.current
            if (v) { const on = r.top < innerHeight && r.bottom > 0; if (on && v.paused) v.play().catch(() => {}); if (!on && !v.paused) v.pause() }
        }
        loop(); return () => cancelAnimationFrame(raf)
    }, [])
    const mono = { fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" as const }
    return (
        <div ref={sec} style={{ width: "100%", height: "100%", position: "relative", background: "var(--bg)", color: "var(--fg)" }}>
            <div style={{ position: "sticky", top: 0, height: "100vh", display: "grid", placeItems: "center", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(16px,3.2vw,48px)", fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(56px,12vw,210px)", letterSpacing: "-.05em", textTransform: "uppercase", pointerEvents: "none" }}>
                    <span ref={a}>Play</span><span ref={b} style={{ WebkitTextStroke: "1.5px var(--fg)", color: "transparent" }}>Reel</span>
                </div>
                <div ref={frame} data-cursor="Sound" onClick={() => { if (vid.current) vid.current.muted = !vid.current.muted }} style={{ position: "relative", width: "34vw", aspectRatio: "16/9", borderRadius: 18, overflow: "hidden", zIndex: 2, cursor: "pointer" }}>
                    <video ref={vid} src={u(props.video)} poster={u(props.poster)} muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ ...mono, position: "absolute", left: 18, right: 18, bottom: 14, display: "flex", justifyContent: "space-between", color: "#fff", mixBlendMode: "difference" }}><span>Showreel</span><span>2023 — 2026</span></div>
                </div>
            </div>
        </div>
    )
}
ShowreelExpand.defaultProps = { video: "assets/video/kognivera-diwali.mp4", poster: "assets/video/kognivera-diwali-cover.jpg" }
addPropertyControls(ShowreelExpand, { video: { type: ControlType.String, title: "Video path/URL" }, poster: { type: ControlType.String, title: "Poster path/URL" } })

export default SectionHead
