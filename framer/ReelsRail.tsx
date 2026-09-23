// Reels & Edits — draggable rail of portrait video cards with 3D tilt, glare and velocity skew.
import * as React from "react"
import { REELS, u, useFonts, FONT_D, FONT_M } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 */
export default function ReelsRail() {
    useFonts()
    const rail = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        const el = rail.current!
        let down = false, sx = 0, sl = 0, last = el.scrollLeft, skew = 0, raf = 0
        const pd = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = el.scrollLeft; el.style.cursor = "grabbing" }
        const pm = (e: PointerEvent) => { if (down) el.scrollLeft = sl - (e.clientX - sx) }
        const pu = () => { down = false; el.style.cursor = "grab" }
        el.addEventListener("pointerdown", pd); addEventListener("pointermove", pm); addEventListener("pointerup", pu)
        const cards = [...el.querySelectorAll<HTMLElement>(".sl-reel")]
        const loop = () => {
            raf = requestAnimationFrame(loop)
            const v = el.scrollLeft - last; last = el.scrollLeft
            skew += (Math.max(-18, Math.min(18, -v * 0.6)) - skew) * 0.1
            cards.forEach((c) => (c.style.transform = `rotateY(${skew}deg)`))
        }
        loop()
        // autoplay on touch when in view
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            const v = e.target.querySelector("video") as HTMLVideoElement
            if (matchMedia("(hover:none)").matches) e.isIntersecting ? v.play().catch(() => {}) : v.pause()
        }), { threshold: 0.6 })
        cards.forEach((c) => io.observe(c))
        return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("pointermove", pm); removeEventListener("pointerup", pu) }
    }, [])
    return (
        <div ref={rail} style={{ width: "100%", overflowX: "auto", overflowY: "hidden", background: "var(--bg)", color: "var(--fg)", cursor: "grab", scrollbarWidth: "none", perspective: 1400 } as any}>
            <style>{`.sl-card{position:relative;aspect-ratio:9/16;border-radius:18px;overflow:hidden;background:#101014;transition:transform .5s cubic-bezier(.19,1,.22,1),box-shadow .5s}
            .sl-card:hover{box-shadow:0 30px 80px -20px rgba(212,255,58,.25)}
            .sl-card::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.25),transparent 45%);opacity:0;transition:opacity .4s;pointer-events:none}
            .sl-card:hover::after{opacity:1}`}</style>
            <div style={{ display: "flex", gap: 28, padding: "20px clamp(16px,3.2vw,48px) 30px", width: "max-content" }}>
                {REELS.map((r) => (
                    <article key={r.v} className="sl-reel" style={{ width: "clamp(220px,20vw,300px)", flex: "none", transformStyle: "preserve-3d" }}>
                        <div className="sl-card"
                            onPointerEnter={(e) => (e.currentTarget.querySelector("video") as HTMLVideoElement).play().catch(() => {})}
                            onPointerLeave={(e) => { (e.currentTarget.querySelector("video") as HTMLVideoElement).pause(); e.currentTarget.style.transform = "" }}
                            onPointerMove={(e) => {
                                const c = e.currentTarget, b = c.getBoundingClientRect()
                                const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height
                                c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%")
                                c.style.transform = `rotateY(${(px - 0.5) * 18}deg) rotateX(${-(py - 0.5) * 18}deg)`
                            }}
                            onClick={(e) => { const v = e.currentTarget.querySelector("video") as HTMLVideoElement; v.muted = !v.muted; v.play().catch(() => {}) }}>
                            <video src={u(`assets/video/${r.v}.mp4`)} poster={u(`assets/video/${r.v}.jpg`)} muted loop playsInline preload="none" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginTop: 14 }}>
                            <strong style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 17, lineHeight: 1.15 }}>{r.title}</strong>
                            <span style={{ fontFamily: FONT_M, fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--mut)", whiteSpace: "nowrap" }}>{r.tag}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
