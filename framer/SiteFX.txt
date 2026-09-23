// Site-wide effects: loader, Lenis smooth scroll, blend-mode cursor with labels, grain, fixed nav.
// Drop ONE instance at the top of the page.
import * as React from "react"
import Lenis from "https://esm.sh/lenis@1.1.13"
import { addPropertyControls, ControlType } from "framer"
import { useFonts, ACC, FONT_D, FONT_M, cycleTheme, getPref, useTheme } from "./Shared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 72
 */
export default function SiteFX(props) {
    useFonts()
    const dot = React.useRef<HTMLDivElement>(null), ring = React.useRef<HTMLDivElement>(null)
    const [label, setLabel] = React.useState("")
    const [pct, setPct] = React.useState(0)
    const [gone, setGone] = React.useState(!props.loader)
    const [open, setOpen] = React.useState(false)
    const mode = useTheme()
    const [pref, setPref] = React.useState("auto")
    React.useEffect(() => setPref(getPref()), [mode])
    React.useEffect(() => {
        const isCanvas = !!document.querySelector("[data-framer-component-type='Canvas']") || location.host.includes("framercanvas")
        let lenis: any = null
        if (props.smooth && !isCanvas) {
            lenis = new Lenis({ lerp: 0.09 })
            ;(window as any).__lenis = lenis
        }
        const m = { x: innerWidth / 2, y: innerHeight / 2 }, r = { ...m }
        const mv = (e: PointerEvent) => {
            m.x = e.clientX; m.y = e.clientY
            if (dot.current) dot.current.style.transform = `translate(${m.x}px,${m.y}px) translate(-50%,-50%)`
            const t = (e.target as HTMLElement)?.closest?.("a,button,[data-cursor],canvas,video,.sl-row") as HTMLElement | null
            setLabel(t ? t.getAttribute("data-cursor") || (t.tagName === "CANVAS" ? "Drag" : t.tagName === "VIDEO" ? "Play" : t.classList.contains("sl-row") ? "View" : "•") : "")
        }
        addEventListener("pointermove", mv)
        let raf = 0
        const loop = (t: number) => {
            raf = requestAnimationFrame(loop)
            lenis?.raf(t)
            r.x += (m.x - r.x) * 0.16; r.y += (m.y - r.y) * 0.16
            if (ring.current) ring.current.style.transform = `translate(${r.x}px,${r.y}px) translate(-50%,-50%)`
        }
        raf = requestAnimationFrame(loop)
        // loader: count with real page load
        if (props.loader && !isCanvas) {
            document.documentElement.style.overflow = "hidden"
            const t0 = performance.now(); let loaded = document.readyState === "complete"
            addEventListener("load", () => (loaded = true))
            let v = 0
            const step = () => {
                const target = Math.min((performance.now() - t0) / 1900, loaded ? 1 : 0.85)
                v += (target - v) * 0.12; setPct(Math.round(v * 100))
                if (v > 0.995 || performance.now() - t0 > 8000) { setPct(100); setTimeout(() => { setGone(true); document.documentElement.style.overflow = "" }, 250); return }
                requestAnimationFrame(step)
            }
            step()
        } else setGone(true)
        return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", mv); lenis?.destroy() }
    }, [])
    const go = (id: string) => (e: any) => {
        e.preventDefault(); setOpen(false)
        const el = document.getElementById(id); if (!el) return
        const l = (window as any).__lenis
        l ? l.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: "smooth" })
    }
    const mono = { fontFamily: FONT_M, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#fff", textDecoration: "none" }
    const links = ["work", "reels", "about", "contact"]
    const big = label && label !== "•"
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <style>{`@media (hover:hover) and (pointer:fine){html,body,a,button{cursor:none!important}}
            @media (hover:none){.sl-cur{display:none}} @media(max-width:900px){.sl-nl{display:none!important}.sl-burger{display:flex!important}}
            @keyframes slGrain{0%,100%{background-position:0 0}20%{background-position:-40px 30px}40%{background-position:30px -50px}60%{background-position:-30px 40px}80%{background-position:50px 20px}}
            [data-theme=light] .sl-nav{mix-blend-mode:normal!important}[data-theme=light] .sl-nav *{color:var(--fg)!important;border-color:var(--line)!important}
            @keyframes slPulse{0%{box-shadow:0 0 0 0 rgba(212,255,58,.7)}70%{box-shadow:0 0 0 10px rgba(212,255,58,0)}100%{box-shadow:0 0 0 0 rgba(212,255,58,0)}}`}</style>
            {/* nav */}
            <header className="sl-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px clamp(16px,3.2vw,48px)", mixBlendMode: "difference" }}>
                <a href="#" onClick={(e) => { e.preventDefault(); const l = (window as any).__lenis; l ? l.scrollTo(0) : scrollTo({ top: 0, behavior: "smooth" }) }} style={{ fontFamily: FONT_D, fontWeight: 900, fontSize: 22, letterSpacing: "-.04em", color: "#fff", textDecoration: "none" }} data-cursor="Top">SL<sup style={{ fontSize: 10 }}>®</sup></a>
                <nav className="sl-nl" style={{ display: "flex", gap: 34 }}>{links.map((l) => <a key={l} href={`#${l}`} onClick={go(l)} style={mono}>{l}</a>)}</nav>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span className="sl-nl" style={{ ...mono, fontSize: 11, display: "flex", alignItems: "center", gap: 8 }}><i style={{ width: 7, height: 7, borderRadius: 9, background: ACC, animation: "slPulse 2s infinite" }} />{props.status}</span>
                <button onClick={() => { cycleTheme(); setPref(getPref()) }} data-cursor="Theme" style={{ ...mono, fontSize: 11, display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,.35)", borderRadius: 99, padding: "6px 12px 6px 6px", background: "none", cursor: "pointer" }}><span style={{ width: 20, height: 20, borderRadius: 99, position: "relative", overflow: "hidden", background: "#fff" }}><span style={{ position: "absolute", inset: 0, borderRadius: 99, background: "#000", transform: mode === "light" ? "translate(120%,-120%)" : "translate(45%,-35%)", transition: "transform .6s cubic-bezier(.19,1,.22,1)" }} /></span><span className="sl-nl">{pref === "auto" ? `Auto · ${mode === "light" ? "Day" : "Night"}` : mode === "light" ? "Light" : "Dark"}</span></button>
                <button className="sl-burger" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: 0, color: "#fff", ...mono }}>{open ? "Close" : "Menu"}</button>
                </div>
            </header>
            <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "var(--bg)", display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, gap: 6, clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", transition: "clip-path .8s cubic-bezier(.19,1,.22,1)" }}>
                {links.map((l) => <a key={l} href={`#${l}`} onClick={go(l)} style={{ fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(48px,14vw,96px)", lineHeight: 1, letterSpacing: "-.04em", color: "var(--fg)", textDecoration: "none", textTransform: "capitalize" }}>{l}</a>)}
            </div>
            {/* grain */}
            <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 90, pointerEvents: "none", opacity: 0.06, animation: "slGrain 1s steps(6) infinite",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
            {/* cursor */}
            <div className="sl-cur" style={{ position: "fixed", left: 0, top: 0, zIndex: 10000, pointerEvents: "none", mixBlendMode: "difference" }}>
                <div ref={dot} style={{ position: "absolute", width: 6, height: 6, borderRadius: 9, background: "#fff" }} />
                <div ref={ring} style={{ position: "absolute", width: big ? 88 : label ? 64 : 40, height: big ? 88 : label ? 64 : 40, borderRadius: 99, border: "1px solid rgba(255,255,255,.6)", background: big ? "#fff" : "transparent",
                    display: "grid", placeItems: "center", transition: "width .4s cubic-bezier(.19,1,.22,1),height .4s cubic-bezier(.19,1,.22,1),background .3s" }}>
                    <span style={{ fontFamily: FONT_M, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#000", opacity: big ? 1 : 0 }}>{label}</span>
                </div>
            </div>
            {/* loader */}
            {!gone && (
                <div style={{ position: "fixed", inset: 0, zIndex: 20000, background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(16px,3.2vw,48px)",
                    clipPath: pct >= 100 ? "inset(0 0 100% 0)" : "inset(0 0 0 0)", transition: "clip-path 1s cubic-bezier(.77,0,.18,1)" }}>
                    <div style={{ fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(96px,22vw,340px)", lineHeight: 0.8, letterSpacing: "-.05em" }}>{pct}<sup style={{ fontSize: ".25em", color: ACC }}>%</sup></div>
                    <div style={{ height: 1, background: "var(--line)", marginTop: 24 }}><i style={{ display: "block", height: 1, width: pct + "%", background: ACC }} /></div>
                </div>
            )}
        </div>
    )
}
SiteFX.defaultProps = { smooth: true, loader: true, status: "Open to work" }
addPropertyControls(SiteFX, {
    smooth: { type: ControlType.Boolean, title: "Smooth scroll" },
    loader: { type: ControlType.Boolean, title: "Loader" },
    status: { type: ControlType.String, title: "Status" },
})
