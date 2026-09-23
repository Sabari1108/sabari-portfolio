// Shared data + project modal for the Framer version of Sabari's portfolio.
// Assets are served from the GitHub Pages build so both versions use the same media.
import * as React from "react"
import { createPortal } from "react-dom"

export const BASE = "https://sabari1108.github.io/sabari-portfolio/"
export const u = (p: string) => (p.startsWith("http") ? p : BASE + p)
export const ACC = "var(--acc)"
export const FONT_D = "'Inter Tight', 'Inter', sans-serif"
export const FONT_S = "'Instrument Serif', Georgia, serif"
export const FONT_M = "'JetBrains Mono', ui-monospace, monospace"
export const FONT_B = "'Manrope', 'Inter', sans-serif"

const THEME_CSS = `:root,[data-theme=dark]{--bg:#08080a;--bg2:#121216;--fg:#eeeae2;--txt2:#c9c5bc;--mut:#8a877f;--line:rgba(238,234,226,.12);--acc:#d4ff3a;--acc-ink:#0b0b0b;--acc2:#ff5a1f}
[data-theme=light]{--bg:#ece8e0;--bg2:#e1dcd2;--fg:#111113;--txt2:#3b3934;--mut:#6b675f;--line:rgba(17,17,19,.13);--acc:#3b2bff;--acc-ink:#fff;--acc2:#ff4a12}
html,body{background:var(--bg)}.sl-theme-anim,.sl-theme-anim *{transition:background-color .6s,color .6s,border-color .6s!important}`

// Theme: follows the visitor's clock (light 06–18h) unless they pick Light/Dark with the toggle.
export function getPref() { try { return localStorage.getItem("sl-theme") || "auto" } catch (e) { return "auto" } }
export function applyTheme(pref = getPref()) {
    if (typeof document === "undefined") return
    const h = new Date().getHours()
    const mode = pref === "auto" ? (h >= 6 && h < 18 ? "light" : "dark") : pref
    document.documentElement.dataset.theme = mode
    window.dispatchEvent(new CustomEvent("themechange", { detail: { mode, pref } }))
    return mode
}
export function cycleTheme() {
    const order = ["auto", "light", "dark"], next = order[(order.indexOf(getPref()) + 1) % 3]
    try { localStorage.setItem("sl-theme", next) } catch (e) {}
    document.documentElement.classList.add("sl-theme-anim"); setTimeout(() => document.documentElement.classList.remove("sl-theme-anim"), 700)
    return applyTheme(next)
}
export function useTheme() {
    const [mode, setMode] = React.useState("dark")
    React.useEffect(() => {
        const f = (e: any) => setMode(e.detail.mode)
        addEventListener("themechange", f)
        setMode(document.documentElement.dataset.theme || applyTheme() || "dark")
        return () => removeEventListener("themechange", f)
    }, [])
    return mode
}
export function useFonts() {
    React.useEffect(() => {
        if (document.getElementById("sl-fonts")) return
        const l = document.createElement("link")
        l.id = "sl-fonts"; l.rel = "stylesheet"; l.href = BASE + "assets/css/fonts.css"
        document.head.appendChild(l)
        const st = document.createElement("style"); st.id = "sl-theme"; st.textContent = THEME_CSS; document.head.appendChild(st)
        if (!document.documentElement.dataset.theme) applyTheme()
        if (!(window as any).__slThemeTimer) (window as any).__slThemeTimer = setInterval(() => getPref() === "auto" && applyTheme("auto"), 60000)
    }, [])
}

export const PROJECTS: any[] = [
 {
  "id": "alpha",
  "title": "Introducing ALPHA",
  "client": "Zootopia · Lung Cancer Product",
  "cat": "Motion · Launch",
  "color": "#b3176b",
  "cover": "assets/img/alpha-static.webp",
  "texture": "assets/video/alpha-teaser.jpg",
  "desc": "A product teaser for ALPHA, a new lung-cancer therapy. DNA helixes, capsules and a glowing product reveal, cut to a launch countdown and a matching static for WhatsApp outreach to doctors.",
  "tags": [
   "3D Motion",
   "After Effects",
   "Product Reveal"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/alpha-teaser.mp4",
    "poster": "assets/video/alpha-teaser.jpg"
   },
   {
    "type": "img",
    "src": "assets/img/alpha-static.webp"
   }
  ]
 },
 {
  "id": "kognivera",
  "title": "One Small Spark",
  "client": "Kognivera · Diwali Film",
  "cat": "Animation · Storytelling",
  "color": "#f59e0b",
  "cover": "assets/video/kognivera-diwali-cover.jpg",
  "texture": "assets/video/kognivera-diwali-cover.jpg",
  "desc": "An illustrated Diwali short built around one idea: Diwali isn’t just about lights, it’s about togetherness. One small diya lights up a night of lanterns, rangoli and friends celebrating together. Character animation, lighting, pacing and sound in 40 seconds.",
  "tags": [
   "2D Animation",
   "AI Visuals",
   "Sound Design"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/kognivera-diwali.mp4",
    "poster": "assets/video/kognivera-diwali.jpg"
   }
  ]
 },
 {
  "id": "rudraksha",
  "title": "Rudraksha",
  "client": "Dharmāyana · AI Film",
  "cat": "AI Video · Direction",
  "color": "#c2410c",
  "cover": "assets/video/rudraksha-ai-video.jpg",
  "texture": "assets/video/rudraksha-ai-video.jpg",
  "desc": "A devotional AI film for Dharmāyana. Macro rudraksha beads, candlelight and a meditating seeker, built from a character reference sheet and a shot-by-shot storyboard, with an AI voiceover.",
  "tags": [
   "Generative Video",
   "Storyboarding",
   "Voiceover"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/rudraksha-ai-video.mp4",
    "poster": "assets/video/rudraksha-ai-video.jpg"
   },
   {
    "type": "img",
    "src": "assets/img/rudraksha-character-sheet.webp"
   }
  ]
 },
 {
  "id": "dharmayana",
  "title": "Dharmāyana Identity",
  "client": "Dharmāyana · Brand",
  "cat": "Logo Motion · Performance Ads",
  "color": "#0f766e",
  "cover": "assets/img/dharmayana-poster-2.webp",
  "texture": "assets/img/dharmayana-poster-2.webp",
  "desc": "A lotus-bloom logo animation in landscape and portrait, plus performance-marketing posters: “Should I text him?” for astrology and an Ekadashi special offer at Rameshwaram.",
  "tags": [
   "Logo Animation",
   "Meta Ads",
   "Art Direction"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/dharmayana-logo-landscape.mp4",
    "poster": "assets/video/dharmayana-logo-landscape.jpg"
   },
   {
    "type": "img",
    "src": "assets/img/dharmayana-poster-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/dharmayana-poster-2.webp"
   },
   {
    "type": "video",
    "src": "assets/video/dharmayana-logo-portrait.mp4",
    "poster": "assets/video/dharmayana-logo-portrait.jpg"
   }
  ]
 },
 {
  "id": "ajio",
  "title": "Big Bold Sale",
  "client": "AJIO · Campaign Concept",
  "cat": "Key Visual · Landing Pages",
  "color": "#4338ca",
  "cover": "assets/img/idex-key-visual-dark.webp",
  "texture": "assets/img/idex-key-visual-dark.webp",
  "desc": "A campaign system for AJIO’s Big Bold Sale: a “Shop like a Celeb” key visual in light and dark, a sale lock-up, Meta ad frames in square and portrait, and concept notes for the men’s and women’s landing pages.",
  "tags": [
   "Campaign",
   "Key Visual",
   "Meta Ads",
   "Landing Page"
  ],
  "media": [
   {
    "type": "img",
    "src": "assets/img/idex-key-visual-dark.webp"
   },
   {
    "type": "img",
    "src": "assets/img/idex-key-visual-light.webp"
   },
   {
    "type": "img",
    "src": "assets/img/idex-portrait-dark.webp"
   },
   {
    "type": "img",
    "src": "assets/img/idex-portrait-2.webp"
   },
   {
    "type": "img",
    "src": "assets/img/idex-logo-dark.webp"
   },
   {
    "type": "img",
    "src": "assets/img/idex-concept-men.webp"
   },
   {
    "type": "img",
    "src": "assets/img/idex-concept-women.webp"
   }
  ]
 },
 {
  "id": "jd",
  "title": "Design Your Future",
  "client": "JD Institute of Fashion Technology",
  "cat": "Carousel · Reel",
  "color": "#2563eb",
  "cover": "assets/img/jd-slide-1.webp",
  "texture": "assets/img/jd-slide-1.webp",
  "desc": "An admissions campaign for JD Institute, Bangalore: a six-slide carousel covering UI/UX, Graphic Design, Animation and Immersive Design, a static post and a motion-graphic reel.",
  "tags": [
   "Social Carousel",
   "Motion Graphics",
   "Education"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/jd-reel.mp4",
    "poster": "assets/video/jd-reel.jpg"
   },
   {
    "type": "img",
    "src": "assets/img/jd-slide-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/jd-slide-2.webp"
   },
   {
    "type": "img",
    "src": "assets/img/jd-slide-3.webp"
   },
   {
    "type": "img",
    "src": "assets/img/jd-slide-4.webp"
   },
   {
    "type": "img",
    "src": "assets/img/jd-slide-5.webp"
   },
   {
    "type": "img",
    "src": "assets/img/jd-slide-6.webp"
   },
   {
    "type": "img",
    "src": "assets/img/jd-static.webp"
   }
  ]
 },
 {
  "id": "vaishnavi",
  "title": "Caring Beyond the Cure",
  "client": "Vaishnavi Hospitals",
  "cat": "Healthcare · Social",
  "color": "#6d28d9",
  "cover": "assets/img/vaishnavi-1.webp",
  "texture": "assets/img/vaishnavi-1.webp",
  "desc": "Social content for Vaishnavi Hospitals in HSR Layout: a World Diabetes Day carousel, a free screening camp campaign, cover pages for every platform and a welcome film for the hospital.",
  "tags": [
   "Carousel",
   "Cover Design",
   "Motion Graphic"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/vaishnavi-reel.mp4",
    "poster": "assets/video/vaishnavi-reel.jpg"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-2.webp"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-5.webp"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-6.webp"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-cover-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-cover-3.webp"
   },
   {
    "type": "img",
    "src": "assets/img/vaishnavi-cover-4.webp"
   }
  ]
 },
 {
  "id": "houzlook",
  "title": "Houzlook Interiors",
  "client": "Houzlook · Brand Campaigns",
  "cat": "Print · Social · OOH",
  "color": "#dc2626",
  "cover": "assets/img/houzlook-carousel-1.webp",
  "texture": "assets/img/houzlook-carousel-1.webp",
  "desc": "A year of design for a Bangalore interiors brand: an Experience Center launch poster and opening offer, a Diwali Meta ad deck, an eight-slide brand carousel, truck branding and staff T-shirts.",
  "tags": [
   "Poster",
   "Meta Ads",
   "Vehicle Branding",
   "Merch"
  ],
  "media": [
   {
    "type": "img",
    "src": "assets/img/houzlook-launch-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-opening-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-diwali-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-diwali-2.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-carousel-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-carousel-2.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-carousel-3.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-carousel-5.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-truck-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-truck-2.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-tshirt-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/houzlook-tshirt-4.webp"
   },
   {
    "type": "img",
    "src": "assets/img/testimonials-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/testimonials-2.webp"
   }
  ]
 },
 {
  "id": "glentree",
  "title": "Glentree Academy",
  "client": "Glentree Academy · School",
  "cat": "Reels · Festive Posts",
  "color": "#16a34a",
  "cover": "assets/img/vishu-post.webp",
  "texture": "assets/img/vishu-post.webp",
  "desc": "Daily content for a CBSE school: an admissions film, a potato-harvest story told through the students, and festive and awareness posts for Vishu, Easter and the International Day of Happiness.",
  "tags": [
   "Video Editing",
   "Social",
   "Print"
  ],
  "media": [
   {
    "type": "video",
    "src": "assets/video/story-video.mp4",
    "poster": "assets/video/story-video.jpg"
   },
   {
    "type": "video",
    "src": "assets/video/potato-farming.mp4",
    "poster": "assets/video/potato-farming.jpg"
   },
   {
    "type": "img",
    "src": "assets/img/vishu-post.webp"
   },
   {
    "type": "img",
    "src": "assets/img/glentree-easter.webp"
   },
   {
    "type": "img",
    "src": "assets/img/glentree-happiness-1.webp"
   },
   {
    "type": "img",
    "src": "assets/img/glentree-happiness-2.webp"
   }
  ]
 },
 {
  "id": "astrazeneca",
  "title": "Visual Design & AI Showreel",
  "client": "AstraZeneca",
  "cat": "Showreel · AI Workflows",
  "color": "#7c3aed",
  "cover": "assets/img/cover-astrazeneca.webp",
  "texture": "assets/img/cover-astrazeneca.webp",
  "desc": "An introduction showreel of my work as a Visual Designer at AstraZeneca, mixing traditional corporate design with modern AI-driven workflows.",
  "tags": [
   "Showreel",
   "Corporate",
   "AI"
  ],
  "media": [
   {
    "type": "embed",
    "src": "https://www-ccv.adobe.io/v1/player/ccv/5ztPAvsinQW/embed?api_key=behance1&bgcolor=%23191919",
    "link": "https://www.behance.net/gallery/250789139/Visual-Design-AI-Showreel-AstraZeneca"
   }
  ]
 }
]
export const REELS: any[] = [{"title": "Why Hampi for Solo Travellers", "tag": "Travel Reel", "v": "hampi-solo"}, {"title": "Ancient Wonders of Hampi", "tag": "Travel Reel", "v": "hampi-wonder"}, {"title": "Welcome to Vaishnavi", "tag": "Motion Graphic", "v": "vaishnavi-reel"}, {"title": "Rudraksha", "tag": "AI Film", "v": "rudraksha-ai-video"}, {"title": "Career in Design", "tag": "JD Institute", "v": "jd-reel"}, {"title": "Retainers After Invisalign", "tag": "Healthcare Reel", "v": "invisalign-reel"}, {"title": "Anuvic Designs", "tag": "Agency Promo", "v": "anuvic-reel"}, {"title": "Raw to Cinematic", "tag": "Editing Promo", "v": "video-editing-promo"}, {"title": "Dharmāyana Bloom", "tag": "Logo Animation", "v": "dharmayana-logo-portrait"}]
export const EXPERIENCE: any[] = [{"when": "2025 — Now", "role": "Graphic & VFX Designer", "org": "Glentree Academy", "note": "Daily reels, posters, banners and flex designs, plus illustrated printables for nursery kids."}, {"when": "2024 — 2025", "role": "Graphic & VFX Designer", "org": "Anuvic Designs", "note": "Motion graphics and video editing: reels, posters and print for multiple clients."}, {"when": "2023 — 2024", "role": "Graphic Designer", "org": "QSpiders Software", "note": "Daily social and print creatives. Shot and edited testimonial videos for reels."}, {"when": "2023 — 2024", "role": "UI & UX Designer (course)", "org": "SkillTo Education", "note": "Design principles with Figma, Framer, Illustrator and Photoshop."}, {"when": "2021 — 2024", "role": "BBA, Marketing Management", "org": "RD National College", "note": "Business insight combined with creativity."}]
export const TOOLS: any[] = [["Ai", "Illustrator"], ["Ps", "Photoshop"], ["Ae", "After Effects"], ["Pr", "Premiere Pro"], ["Id", "InDesign"], ["Fi", "Figma"], ["Fr", "Framer"], ["AI", "Gen-AI Video"]]

// tiny event bus so any component can open the shared modal
const listeners = new Set<(i: number) => void>()
export function openProject(i: number) { listeners.forEach((f) => f(i)) }

export function ProjectModal() {
    const [i, setI] = React.useState(-1)
    const [show, setShow] = React.useState(false)
    React.useEffect(() => {
        const w = window as any
        if (w.__slModalOwner) return
        const f = (n: number) => { setI(n); requestAnimationFrame(() => setShow(true)) }
        w.__slModalOwner = f
        listeners.add(f)
        return () => { listeners.delete(f); w.__slModalOwner = null }
    }, [])
    React.useEffect(() => {
        const k = (e: KeyboardEvent) => e.key === "Escape" && close()
        addEventListener("keydown", k)
        return () => removeEventListener("keydown", k)
    })
    React.useEffect(() => {
        document.documentElement.style.overflow = i >= 0 ? "hidden" : ""
    }, [i])
    const close = () => { setShow(false); setTimeout(() => setI(-1), 700) }
    if (i < 0 || typeof document === "undefined") return null
    const p = PROJECTS[i], nx = PROJECTS[(i + 1) % PROJECTS.length]
    return createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg)", color: "var(--fg)", overflowY: "auto",
            clipPath: show ? "inset(0 0 0 0)" : "inset(100% 0 0 0)", transition: "clip-path .9s cubic-bezier(.77,0,.18,1)", fontFamily: FONT_B }}>
            <button onClick={close} style={{ position: "fixed", top: 18, right: 24, width: 52, height: 52, borderRadius: 99, border: "1px solid var(--line)", background: "var(--bg)", color: "#eee", fontSize: 16, cursor: "pointer", zIndex: 2 }}>✕</button>
            <div style={{ padding: "110px clamp(16px,3.2vw,48px) 60px", maxWidth: 1600, margin: "0 auto" }}>
                <div style={{ fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: ACC }}>{p.cat}</div>
                <h2 style={{ fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(44px,9vw,150px)", lineHeight: .88, letterSpacing: "-.055em", textTransform: "uppercase", margin: "12px 0" }}>{p.title}</h2>
                <div style={{ fontFamily: FONT_M, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--mut)" }}>{p.client}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", borderTop: "1px solid var(--line)", marginTop: 30, padding: "28px 0 50px" }}>
                    <p style={{ fontSize: "clamp(17px,1.5vw,22px)", color: "var(--txt2)", maxWidth: 720, margin: 0 }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignContent: "flex-start" }}>
                        {p.tags.map((t: string) => <span key={t} style={{ border: "1px solid var(--line)", borderRadius: 99, padding: "8px 14px", fontFamily: FONT_M, fontSize: 11, textTransform: "uppercase" }}>{t}</span>)}
                    </div>
                </div>
                <div style={{ columns: "2 380px", columnGap: 18 }}>
                    {p.media.map((m: any, k: number) => (
                        <div key={k} style={{ breakInside: "avoid", marginBottom: 18, borderRadius: 14, overflow: "hidden", background: "var(--bg2)", columnSpan: k === 0 && m.type !== "img" ? "all" : undefined } as any}>
                            {m.type === "video" && <video src={u(m.src)} poster={u(m.poster)} controls playsInline muted={k === 0} autoPlay={k === 0} loop={k === 0} style={{ width: "100%", display: "block" }} />}
                            {m.type === "img" && <img src={u(m.src)} loading="lazy" style={{ width: "100%", display: "block" }} alt={p.title} />}
                            {m.type === "embed" && <div><div style={{ aspectRatio: "16/9", position: "relative" }}><iframe src={m.src} allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div>
                                <a href={m.link} target="_blank" style={{ display: "block", padding: 16, color: "#eee", fontFamily: FONT_M, fontSize: 11, textTransform: "uppercase" }}>Watch on Behance ↗</a></div>}
                        </div>
                    ))}
                </div>
                <button onClick={() => setI((i + 1) % PROJECTS.length)} style={{ display: "block", width: "100%", textAlign: "left", marginTop: 60, paddingTop: 30, borderLeft: 0, borderRight: 0, borderBottom: 0, borderTop: "1px solid var(--line)", background: "none", color: "#eee", cursor: "pointer" }}>
                    <div style={{ fontFamily: FONT_M, fontSize: 11, textTransform: "uppercase", color: "var(--mut)" }}>Next project</div>
                    <div style={{ fontFamily: FONT_D, fontWeight: 900, fontSize: "clamp(36px,6vw,96px)", letterSpacing: "-.05em", lineHeight: .9, textTransform: "uppercase" }}>{nx.title}</div>
                </button>
            </div>
        </div>,
        document.body
    )
}

export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export const mouse = { x: 0, y: 0, nx: 0, ny: 0 }
if (typeof window !== "undefined" && !(window as any).__slMouse) {
    ;(window as any).__slMouse = true
    addEventListener("pointermove", (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY
        mouse.nx = (e.clientX / innerWidth) * 2 - 1
        mouse.ny = -(e.clientY / innerHeight) * 2 + 1
    })
}
export const isCanvas = () => typeof window !== "undefined" && (window.location.host.includes("framercanvas") || (window as any).__framer_is_canvas)
