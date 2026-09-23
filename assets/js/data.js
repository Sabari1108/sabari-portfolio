// All project content. Images come from Behance + Google Drive project files.
const I = (n) => `assets/img/${n}.webp`;
const V = (n) => ({ type: 'video', src: `assets/video/${n}.mp4`, poster: `assets/video/${n}.jpg` });
const P = (n) => ({ type: 'img', src: I(n) });

export const PROFILE = {
  name: 'Sabari Logesh A',
  role: 'Graphic Designer & Video Editor',
  location: 'Electronic City, Bangalore',
  email: 'sabarilogesh11@gmail.com',
  phone: '+91 99445 38700',
  behance: 'https://www.behance.net/sabarilogesh',
  linkedin: 'https://linkedin.com/in/sabari-logesh-8b44a31a7/',
  resume: 'assets/sabari-logesh-resume.pdf',
};

export const PROJECTS = [
  {
    id: 'alpha', title: 'Introducing ALPHA', client: 'Zootopia · Lung Cancer Product',
    cat: 'Motion · Launch', color: '#b3176b',
    cover: I('alpha-static'), texture: 'assets/video/alpha-teaser.jpg',
    desc: 'A product teaser for ALPHA, a new lung-cancer therapy. DNA helixes, capsules and a glowing product reveal, cut to a launch countdown and a matching static for WhatsApp outreach to doctors.',
    tags: ['3D Motion', 'After Effects', 'Product Reveal'],
    media: [V('alpha-teaser'), P('alpha-static')],
  },
  {
    id: 'kognivera', title: 'One Small Spark', client: 'Kognivera · Diwali Film',
    cat: 'Animation · Storytelling', color: '#f59e0b',
    cover: 'assets/video/kognivera-diwali-cover.jpg', texture: 'assets/video/kognivera-diwali-cover.jpg',
    desc: 'An illustrated Diwali short built around one idea: Diwali isn’t just about lights, it’s about togetherness. One small diya lights up a night of lanterns, rangoli and friends celebrating together. Character animation, lighting, pacing and sound in 40 seconds.',
    tags: ['2D Animation', 'AI Visuals', 'Sound Design'],
    media: [V('kognivera-diwali')],
  },
  {
    id: 'rudraksha', title: 'Rudraksha', client: 'Dharmāyana · AI Film',
    cat: 'AI Video · Direction', color: '#c2410c',
    cover: 'assets/video/rudraksha-ai-video.jpg', texture: 'assets/video/rudraksha-ai-video.jpg',
    desc: 'A devotional AI film for Dharmāyana. Macro rudraksha beads, candlelight and a meditating seeker, built from a character reference sheet and a shot-by-shot storyboard, with an AI voiceover.',
    tags: ['Generative Video', 'Storyboarding', 'Voiceover'],
    media: [V('rudraksha-ai-video'), P('rudraksha-character-sheet')],
  },
  {
    id: 'dharmayana', title: 'Dharmāyana Identity', client: 'Dharmāyana · Brand',
    cat: 'Logo Motion · Performance Ads', color: '#0f766e',
    cover: I('dharmayana-poster-2'), texture: I('dharmayana-poster-2'),
    desc: 'A lotus-bloom logo animation in landscape and portrait, plus performance-marketing posters: “Should I text him?” for astrology and an Ekadashi special offer at Rameshwaram.',
    tags: ['Logo Animation', 'Meta Ads', 'Art Direction'],
    media: [V('dharmayana-logo-landscape'), P('dharmayana-poster-1'), P('dharmayana-poster-2'), V('dharmayana-logo-portrait')],
  },
  {
    id: 'ajio', title: 'Big Bold Sale', client: 'AJIO · Campaign Concept',
    cat: 'Key Visual · Landing Pages', color: '#4338ca',
    cover: I('idex-key-visual-dark'), texture: I('idex-key-visual-dark'),
    desc: 'A campaign system for AJIO’s Big Bold Sale: a “Shop like a Celeb” key visual in light and dark, a sale lock-up, Meta ad frames in square and portrait, and concept notes for the men’s and women’s landing pages.',
    tags: ['Campaign', 'Key Visual', 'Meta Ads', 'Landing Page'],
    media: [P('idex-key-visual-dark'), P('idex-key-visual-light'), P('idex-portrait-dark'), P('idex-portrait-2'), P('idex-logo-dark'), P('idex-concept-men'), P('idex-concept-women')],
  },
  {
    id: 'jd', title: 'Design Your Future', client: 'JD Institute of Fashion Technology',
    cat: 'Carousel · Reel', color: '#2563eb',
    cover: I('jd-slide-1'), texture: I('jd-slide-1'),
    desc: 'An admissions campaign for JD Institute, Bangalore: a six-slide carousel covering UI/UX, Graphic Design, Animation and Immersive Design, a static post and a motion-graphic reel.',
    tags: ['Social Carousel', 'Motion Graphics', 'Education'],
    media: [V('jd-reel'), P('jd-slide-1'), P('jd-slide-2'), P('jd-slide-3'), P('jd-slide-4'), P('jd-slide-5'), P('jd-slide-6'), P('jd-static')],
  },
  {
    id: 'vaishnavi', title: 'Caring Beyond the Cure', client: 'Vaishnavi Hospitals',
    cat: 'Healthcare · Social', color: '#6d28d9',
    cover: I('vaishnavi-1'), texture: I('vaishnavi-1'),
    desc: 'Social content for Vaishnavi Hospitals in HSR Layout: a World Diabetes Day carousel, a free screening camp campaign, cover pages for every platform and a welcome film for the hospital.',
    tags: ['Carousel', 'Cover Design', 'Motion Graphic'],
    media: [V('vaishnavi-reel'), P('vaishnavi-1'), P('vaishnavi-2'), P('vaishnavi-5'), P('vaishnavi-6'), P('vaishnavi-cover-1'), P('vaishnavi-cover-3'), P('vaishnavi-cover-4')],
  },
  {
    id: 'houzlook', title: 'Houzlook Interiors', client: 'Houzlook · Brand Campaigns',
    cat: 'Print · Social · OOH', color: '#dc2626',
    cover: I('houzlook-carousel-1'), texture: I('houzlook-carousel-1'),
    desc: 'A year of design for a Bangalore interiors brand: an Experience Center launch poster and opening offer, a Diwali Meta ad deck, an eight-slide brand carousel, truck branding and staff T-shirts.',
    tags: ['Poster', 'Meta Ads', 'Vehicle Branding', 'Merch'],
    media: [P('houzlook-launch-1'), P('houzlook-opening-1'), P('houzlook-diwali-1'), P('houzlook-diwali-2'), P('houzlook-carousel-1'), P('houzlook-carousel-2'), P('houzlook-carousel-3'), P('houzlook-carousel-5'), P('houzlook-truck-1'), P('houzlook-truck-2'), P('houzlook-tshirt-1'), P('houzlook-tshirt-4'), P('testimonials-1'), P('testimonials-2')],
  },
  {
    id: 'glentree', title: 'Glentree Academy', client: 'Glentree Academy · School',
    cat: 'Reels · Festive Posts', color: '#16a34a',
    cover: I('vishu-post'), texture: I('vishu-post'),
    desc: 'Daily content for a CBSE school: an admissions film, a potato-harvest story told through the students, and festive and awareness posts for Vishu, Easter and the International Day of Happiness.',
    tags: ['Video Editing', 'Social', 'Print'],
    media: [V('story-video'), V('potato-farming'), P('vishu-post'), P('glentree-easter'), P('glentree-happiness-1'), P('glentree-happiness-2')],
  },
  {
    id: 'astrazeneca', title: 'Visual Design & AI Showreel', client: 'AstraZeneca',
    cat: 'Showreel · AI Workflows', color: '#7c3aed',
    cover: 'assets/img/cover-astrazeneca.webp', texture: 'assets/img/cover-astrazeneca.webp',
    desc: 'An introduction showreel of my work as a Visual Designer at AstraZeneca, mixing traditional corporate design with modern AI-driven workflows.',
    tags: ['Showreel', 'Corporate', 'AI'],
    media: [{ type: 'embed', src: 'https://www-ccv.adobe.io/v1/player/ccv/5ztPAvsinQW/embed?api_key=behance1&bgcolor=%23191919', link: 'https://www.behance.net/gallery/250789139/Visual-Design-AI-Showreel-AstraZeneca' }],
  },
];

export const REELS = [
  { title: 'Why Hampi for Solo Travellers', tag: 'Travel Reel', v: 'hampi-solo' },
  { title: 'Ancient Wonders of Hampi', tag: 'Travel Reel', v: 'hampi-wonder' },
  { title: 'Welcome to Vaishnavi', tag: 'Motion Graphic', v: 'vaishnavi-reel' },
  { title: 'Rudraksha', tag: 'AI Film', v: 'rudraksha-ai-video' },
  { title: 'Career in Design', tag: 'JD Institute', v: 'jd-reel' },
  { title: 'Retainers After Invisalign', tag: 'Healthcare Reel', v: 'invisalign-reel' },
  { title: 'Anuvic Designs', tag: 'Agency Promo', v: 'anuvic-reel' },
  { title: 'Raw to Cinematic', tag: 'Editing Promo', v: 'video-editing-promo' },
  { title: 'Dharmāyana Bloom', tag: 'Logo Animation', v: 'dharmayana-logo-portrait' },
];

export const EXPERIENCE = [
  { when: '2025 — Now', role: 'Graphic & VFX Designer', org: 'Glentree Academy', note: 'Daily reels, posters, banners and flex designs, plus illustrated printables for nursery kids.' },
  { when: '2024 — 2025', role: 'Graphic & VFX Designer', org: 'Anuvic Designs', note: 'Motion graphics and video editing: reels, posters and print for multiple clients.' },
  { when: '2023 — 2024', role: 'Graphic Designer', org: 'QSpiders Software', note: 'Daily social and print creatives. Shot and edited testimonial videos for reels.' },
  { when: '2023 — 2024', role: 'UI & UX Designer (course)', org: 'SkillTo Education', note: 'Design principles with Figma, Framer, Illustrator and Photoshop.' },
  { when: '2021 — 2024', role: 'BBA, Marketing Management', org: 'RD National College', note: 'Business insight combined with creativity.' },
];

export const TOOLS = [
  ['Ai', 'Illustrator'], ['Ps', 'Photoshop'], ['Ae', 'After Effects'], ['Pr', 'Premiere Pro'],
  ['Id', 'InDesign'], ['Fi', 'Figma'], ['Fr', 'Framer'], ['AI', 'Gen-AI Video'],
];
