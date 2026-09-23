import * as THREE from 'three';
import { PROJECTS, REELS, EXPERIENCE, TOOLS } from './data.js';

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
const isMobile = () => innerWidth <= 900;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouse = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 };

/* ------------------------------------------------ smooth scroll */
const lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

$$('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    lenis.start();
    lenis.scrollTo(t, { duration: 1.6 });
  })
);
$('#menuBtn').addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  open ? lenis.stop() : lenis.start();
});

/* ------------------------------------------------ split text */
function split(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  [...text].forEach((c) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = c === ' ' ? ' ' : c;
    frag.appendChild(s);
  });
  el.appendChild(frag);
  return $$('.char', el);
}
$$('.hero__title .split').forEach(split);
$$('.reveal-title').forEach((h) => {
  // split text nodes but keep <i> wrappers
  [...h.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const span = document.createElement('span');
      span.textContent = n.textContent;
      h.replaceChild(span, n);
      split(span);
    } else split(n);
  });
});

/* ------------------------------------------------ cursor */
const cursor = $('#cursor'), cLabel = $('#cursorLabel');
const dot = $('.cursor__dot'), ring = $('.cursor__ring');
const ringPos = { x: mouse.x, y: mouse.y };
addEventListener('pointermove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  mouse.nx = (e.clientX / innerWidth) * 2 - 1;
  mouse.ny = -(e.clientY / innerHeight) * 2 + 1;
  dot.style.transform = `translate(${mouse.x}px,${mouse.y}px) translate(-50%,-50%)`;
});
gsap.ticker.add(() => {
  ringPos.x += (mouse.x - ringPos.x) * 0.16;
  ringPos.y += (mouse.y - ringPos.y) * 0.16;
  ring.style.transform = `translate(${ringPos.x}px,${ringPos.y}px) translate(-50%,-50%)`;
});
function setCursor(label) {
  if (label) { cLabel.textContent = label; cursor.classList.add('is-label'); }
  else cursor.classList.remove('is-label');
}
function bindCursor(root = document) {
  $$('[data-cursor]', root).forEach((el) => {
    el.addEventListener('pointerenter', () => setCursor(el.dataset.cursor));
    el.addEventListener('pointerleave', () => setCursor(null));
  });
  $$('a:not([data-cursor]), button:not([data-cursor])', root).forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ------------------------------------------------ magnetic */
function bindMagnetic(root = document) {
  if (isTouch) return;
  $$('.magnetic', root).forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ------------------------------------------------ shared GLSL noise */
const NOISE = /* glsl */ `
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

/* ================================================= HERO — viewfinder */
async function initViewfinder(){



// name: split, italic serif accent on one letter, fit to width
const nm=$('#name');nm.innerHTML=[...'Sabari Logesh'].map((c,i)=>`<span class="ch${i===7?' alt':''}" style="transition-delay:${.35+i*.04}s">${c===' '?'<span style="display:inline-block;width:.28em"></span>':c}</span>`).join('');
function fit(){nm.style.fontSize='100px';const w=(()=>{const r=document.createRange();r.selectNodeContents(nm);return r.getBoundingClientRect().width})();const W=nm.parentElement.clientWidth-2*parseFloat(getComputedStyle(nm.parentElement).paddingLeft);nm.style.fontSize=(100*W/w*.995)+'px'}
document.fonts.load('900 100px "Inter Tight"').then(()=>document.fonts.load('italic 400 100px "Instrument Serif"')).then(fit);setTimeout(fit,1500);addEventListener('resize',fit);fit();
let wi=0;const words=$('#word').children;setInterval(()=>{wi=(wi+1)%words.length;[...words].forEach(w=>w.style.transform=`translateY(${-wi*100}%)`)},2400);
// timecode + audio meter
const t0=performance.now();const pad=n=>String(n).padStart(2,'0');
const met=$('#meter');met.innerHTML='<i></i>'.repeat(10);const bars=[...met.children];
setInterval(()=>{const s=(performance.now()-t0)/1000;$('#tc').textContent=`${pad(0)}:${pad(Math.floor(s/60))}:${pad(Math.floor(s%60))}:${pad(Math.floor((s%1)*25))}`;bars.forEach((b,i)=>b.style.height=(15+Math.random()*80*(1-Math.abs(i-4.5)/8))+'%')},40);
// WebGL: animated gradient field + duotone portrait with fluid mouse distortion
const vf=$('#vf'),R=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,isTouch?1.5:2));
const sc=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const tex=await new THREE.TextureLoader().loadAsync('assets/img/me/side-color.webp');tex.colorSpace=THREE.SRGBColorSpace;
const U={uTex:{value:tex},uImg:{value:new THREE.Vector2(tex.image.width,tex.image.height)},uRes:{value:new THREE.Vector2(1,1)},uTime:{value:0},uM:{value:new THREE.Vector2(.5,.5)},uV:{value:new THREE.Vector2()},uH:{value:0},uIn:{value:0},
 uA:{value:new THREE.Color()},uD:{value:new THREE.Color()},uE:{value:new THREE.Color()},uB:{value:new THREE.Color()},uC:{value:new THREE.Color()},uLight:{value:0}};
sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:U,vertexShader:`varying vec2 v;void main(){v=uv;gl_Position=vec4(position,1.);}`,
fragmentShader:`uniform sampler2D uTex;uniform vec2 uImg,uRes,uM,uV;uniform float uTime,uH,uIn,uLight;uniform vec3 uA,uB,uC,uD,uE;varying vec2 v;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
void main(){
  vec2 asp=vec2(uRes.x/uRes.y,1.);vec2 p=v*asp;
  // flowing background
  float t=uTime*.08;vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6-t+3.1));float f=fbm(p*1.3+q*1.8+t*.5);
  vec3 bg=mix(uA,uB,smoothstep(.25,.85,f));bg=mix(bg,uC,smoothstep(.62,.95,f)*.55);
  // portrait placement: height = 104% of frame, anchored bottom, offset right
  float ih=1.04, iw=ih*uImg.x/uImg.y*(uRes.y/uRes.x);
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
  gl_FragColor=vec4(col,1.);}`})));
function size(){const w=vf.clientWidth,h=vf.clientHeight;R.setSize(w,h,false);U.uRes.value.set(w,h)}new ResizeObserver(size).observe(vf);size();
function th(){const l=document.documentElement.dataset.theme==='light';
 U.uLight.value=l?1:0;vf.classList.toggle('lt',l);if(l){U.uA.value.set('#e9e3d8');U.uB.value.set('#cfc6f6');U.uC.value.set('#ff8a4c');U.uD.value.set('#1b1640');U.uE.value.set('#fff6ea')}else{U.uA.value.set('#06050b');U.uB.value.set('#3a1f96');U.uC.value.set('#d4ff3a');U.uD.value.set('#0b0816');U.uE.value.set('#f3eeff')}}
th();addEventListener('themechange',th);
const m=new THREE.Vector2(.5,.5);let hov=0;
vf.addEventListener('pointermove',e=>{const r=vf.getBoundingClientRect();m.set((e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height)});
vf.addEventListener('pointerenter',()=>hov=1);vf.addEventListener('pointerleave',()=>hov=0);
const clk=new THREE.Clock();let inT=0;
let visible=true;new IntersectionObserver(([e])=>visible=e.isIntersecting).observe(vf);const renderOnce=()=>R.render(sc,cam);
(function loop(){requestAnimationFrame(loop);if(!visible)return;const t=clk.getElapsedTime();U.uTime.value=t;if(document.body.classList.contains('is-loading')){inT=t;return renderOnce();}U.uIn.value=Math.min(1,(t-inT)/1.6);
 if(isTouch){const k=t*.35;m.set(.5+.28*Math.sin(k*1.3),.5+.22*Math.sin(k*1.9));hov=.55;}
 const cur=U.uM.value,nx=cur.clone().lerp(m,.1);U.uV.value.lerp(nx.clone().sub(cur),.25);cur.copy(nx);U.uH.value+=(hov-U.uH.value)*.06;R.render(sc,cam)})();

}

/* ================================================= WORK — WebGL 3D roll carousel */
function initRoll(onOpen) {
  const wrap = $('#roll'), canvas = $('#rollCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.5 : 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);

  const n = PROJECTS.length;
  const W = 2.3, H = 3.0, GAP = 0.42;
  const R = (n * (W + GAP)) / (Math.PI * 2);
  const step = (Math.PI * 2) / n;
  const loader = new THREE.TextureLoader();
  const meshes = [];
  const promises = [];

  const vert = /* glsl */ `
    uniform float uR, uVel, uHover, uTime; varying vec2 vUv; varying float vDepth;
    void main(){
      vUv = uv;
      vec3 p = position;
      float th = p.x / uR;
      // bend onto cylinder
      vec3 c = vec3(sin(th)*uR, p.y, cos(th)*uR);
      // velocity wave + hover bulge
      c.z += sin(uv.y*3.14159)*uVel*.35;
      c.y += sin(uv.x*3.14159)*uVel*.08;
      c += normalize(vec3(c.x,0.,c.z))*sin(uv.x*3.14159)*sin(uv.y*3.14159)*uHover*.18;
      vec4 world = modelMatrix*vec4(c,1.);
      vDepth = world.z;
      gl_Position = projectionMatrix*viewMatrix*world;
    }`;
  const frag = /* glsl */ `
    uniform sampler2D uTex; uniform vec2 uImg, uPlane; uniform float uHover, uVel, uTime, uReady, uR; uniform vec3 uBg;
    varying vec2 vUv; varying float vDepth;
    void main(){
      vec2 ratio = vec2(min((uPlane.x/uPlane.y)/(uImg.x/uImg.y),1.), min((uPlane.y/uPlane.x)/(uImg.y/uImg.x),1.));
      vec2 uv = vec2(vUv.x*ratio.x+(1.-ratio.x)*.5, vUv.y*ratio.y+(1.-ratio.y)*.5);
      uv = (uv-.5)*(1.-uHover*.08)+.5;
      float shift = abs(uVel)*.008 + uHover*.003;
      vec3 col;
      col.r = texture2D(uTex, uv+vec2(shift,0.)).r;
      col.g = texture2D(uTex, uv).g;
      col.b = texture2D(uTex, uv-vec2(shift,0.)).b;
      float depth = smoothstep(-uR, uR, vDepth);
      col = mix(uBg, col, mix(.12, 1., depth));
      col = mix(uBg, col, uReady);
      // rounded corners
      vec2 q = abs(vUv-.5)*uPlane; vec2 hb = uPlane*.5-.08;
      float rr = length(max(q-hb,0.))-.08;
      if(rr>0.) discard;
      gl_FragColor = vec4(col, 1.);
    }`;

  PROJECTS.forEach((p, i) => {
    const geo = new THREE.PlaneGeometry(W, H, 48, 32);
    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTex: { value: null }, uImg: { value: new THREE.Vector2(1, 1) }, uPlane: { value: new THREE.Vector2(W, H) },
        uR: { value: R }, uVel: { value: 0 }, uHover: { value: 0 }, uTime: { value: 0 }, uReady: { value: 0 }, uBg: { value: new THREE.Color() },
      },
      vertexShader: vert, fragmentShader: frag,
    });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.y = i * step;
    m.userData = { i, hover: 0 };
    group.add(m);
    meshes.push(m);
    promises.push(new Promise((res) => {
      loader.load(p.texture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.anisotropy = 4;
        mat.uniforms.uTex.value = tex;
        mat.uniforms.uImg.value.set(tex.image.width, tex.image.height);
        gsap.to(mat.uniforms.uReady, { value: 1, duration: 1 });
        res();
      }, undefined, res);
    }));
  });

  const setBg = () => { const c = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(); meshes.forEach((m) => m.material.uniforms.uBg.value.set(c)); };
  setBg(); addEventListener('themechange', setBg);
  // rotation state
  const st = { target: 0, cur: 0, vel: 0, dragging: false, lastX: 0, moved: 0 };
  function size() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dist = w < 700 ? R + 6.8 : R + 7.2;
    camera.position.set(0, 0.2, dist);
    camera.lookAt(0, -0.45, 0);
    camera.updateProjectionMatrix();
  }
  size(); addEventListener('resize', size);

  // drag
  wrap.addEventListener('pointerdown', (e) => { st.dragging = true; st.lastX = e.clientX; st.moved = 0; setCursor('Drag'); });
  addEventListener('pointerup', () => { if (st.dragging) { st.dragging = false; setCursor(hovered >= 0 ? 'Open' : 'Drag'); } });
  addEventListener('pointermove', (e) => {
    if (!st.dragging) return;
    const dx = e.clientX - st.lastX; st.lastX = e.clientX; st.moved += Math.abs(dx);
    st.target += dx * 0.006;
  });
  wrap.addEventListener('pointerenter', () => setCursor('Drag'));
  wrap.addEventListener('pointerleave', () => { setCursor(null); hovered = -1; });
  // page scroll drives rotation too
  lenis.on('scroll', ({ velocity }) => {
    const r = wrap.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) st.target -= gsap.utils.clamp(-40, 40, velocity) * 0.0022;
  });

  // hover + click via raycaster
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = -1;
  wrap.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(meshes)[0];
    const h = hit && hit.point.z > 0 ? hit.object.userData.i : -1;
    if (h !== hovered) { hovered = h; if (!st.dragging) setCursor(h >= 0 ? 'Open' : 'Drag'); }
  });
  wrap.addEventListener('click', () => {
    if (st.moved > 6) return;
    if (hovered >= 0) {
      const a = norm(-hovered * step - st.cur);
      if (Math.abs(a) > step * 0.5) { st.target += a; return; } // bring to front first
      onOpen(hovered);
    }
  });
  // mobile tap: open front card
  if (isTouch) wrap.addEventListener('click', () => { if (st.moved < 6 && hovered < 0) onOpen(active); });

  const norm = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  let active = 0;
  const titleEl = $('#rollTitle'), clientEl = $('#rollClient'), idxEl = $('#rollIdx');
  function setActive(i) {
    if (i === active && titleEl.textContent !== '—') return;
    active = i;
    const p = PROJECTS[i];
    idxEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    gsap.fromTo([titleEl, clientEl], { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 });
    titleEl.textContent = p.title; clientEl.textContent = p.client;
  }
  setActive(0);

  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(wrap);
  let snapT = 0;
  gsap.ticker.add((t, dt) => {
    if (!visible) return;
    if (!st.dragging) {
      // gentle idle drift + snap to nearest card after inactivity
      snapT += dt;
      if (Math.abs(st.target - st.cur) < 0.002 && snapT > 1200) {
        const snapped = Math.round(st.target / step) * step;
        st.target += (snapped - st.target) * 0.06;
      }
    } else snapT = 0;
    if (Math.abs(st.target - st.cur) > 0.01) snapT = 0;
    const prev = st.cur;
    st.cur += (st.target - st.cur) * 0.075;
    st.vel += (gsap.utils.clamp(-1, 1, (st.cur - prev) * 8) - st.vel) * 0.1;
    group.rotation.y = st.cur;
    group.rotation.x = 0.06 + mouse.ny * 0.04;
    group.rotation.z = mouse.nx * 0.02;
    const time = t;
    meshes.forEach((m) => {
      const u = m.material.uniforms;
      u.uVel.value = st.vel;
      u.uTime.value = time;
      const tgt = m.userData.i === hovered ? 1 : 0;
      u.uHover.value += (tgt - u.uHover.value) * 0.1;
    });
    const a = ((-st.cur / step) % n + n) % n;
    setActive(Math.round(a) % n);
    renderer.render(scene, camera);
  });
  return Promise.all(promises);
}

/* ================================================= INDEX list with cursor image reveal */
function initIndex(onOpen) {
  const list = $('#indexList');
  list.innerHTML = PROJECTS.map((p, i) => `
    <li class="index__item" data-i="${i}" data-cursor="View">
      <span class="index__n mono">${String(i + 1).padStart(2, '0')}</span>
      <span class="index__t">${p.title}</span>
      <span class="index__c mono">${p.client}</span>
      <span class="index__k mono">${p.cat}</span>
      <span class="index__a">↗</span>
    </li>`).join('');
  const prev = $('#indexPreview'), inner = $('.index__preview-inner', prev);
  const pos = { x: 0, y: 0 }, cur = { x: 0, y: 0, r: 0 };
  let on = false;
  $$('.index__item', list).forEach((li) => {
    li.addEventListener('click', () => onOpen(+li.dataset.i));
    li.addEventListener('pointerenter', () => {
      const p = PROJECTS[+li.dataset.i];
      const img = new Image(); img.src = p.cover; img.alt = '';
      inner.appendChild(img);
      gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)', scale: 1.3 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 0.7, ease: 'expo.out' });
      while (inner.children.length > 3) inner.firstChild.remove();
      if (!on) { on = true; gsap.to(prev, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }); }
    });
  });
  list.addEventListener('pointerleave', () => { on = false; gsap.to(prev, { opacity: 0, scale: 0.6, duration: 0.4 }); });
  gsap.ticker.add(() => {
    pos.x = mouse.x; pos.y = mouse.y;
    const dx = pos.x - cur.x;
    cur.x += dx * 0.12; cur.y += (pos.y - cur.y) * 0.12;
    cur.r += (gsap.utils.clamp(-15, 15, dx * 0.08) - cur.r) * 0.1;
    prev.style.transform = `translate(${cur.x}px,${cur.y}px) translate(-50%,-50%) rotate(${cur.r}deg) scale(${gsap.getProperty(prev, 'scale')})`;
  });
}

/* ================================================= REELS */
function initReels() {
  const track = $('#reelsTrack');
  track.innerHTML = REELS.map((r) => `
    <article class="reel">
      <div class="reel__card" data-cursor="Play">
        <video src="assets/video/${r.v}.mp4" poster="assets/video/${r.v}.jpg" muted loop playsinline preload="none"></video>
        <span class="reel__play">▶</span>
      </div>
      <div class="reel__meta"><strong>${r.title}</strong><span class="mono">${r.tag}</span></div>
    </article>`).join('');
  $$('.reel__card', track).forEach((card) => {
    const v = $('video', card);
    card.addEventListener('pointerenter', () => { v.play().catch(() => {}); });
    card.addEventListener('pointerleave', () => { v.pause(); gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6 }); });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%'); card.style.setProperty('--my', py * 100 + '%');
      gsap.to(card, { rotateY: (px - 0.5) * 18, rotateX: -(py - 0.5) * 18, duration: 0.4 });
    });
    card.addEventListener('click', () => {
      v.muted = !v.muted; v.play().catch(() => {});
      $('.reel__play', card).textContent = v.muted ? '▶' : '♪';
    });
  });
  // touch: autoplay in view
  if (isTouch) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = $('video', e.target); e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { threshold: 0.6 });
    $$('.reel__card', track).forEach((c) => io.observe(c));
  }
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none' });
      const stt = ScrollTrigger.create({ trigger: '.reels', start: 'top top', end: () => '+=' + dist(), pin: '.reels__pin', scrub: 1, animation: tween, invalidateOnRefresh: true });
      // 3D skew by velocity
      const reels = $$('.reel'); let sk = 0;
      const upd = () => { sk += (gsap.utils.clamp(-18, 18, stt.getVelocity() / -120) - sk) * 0.1; reels.forEach((r) => (r.style.transform = `rotateY(${sk}deg)`)); };
      gsap.ticker.add(upd);
      return () => gsap.ticker.remove(upd);
    },
  });
}

/* ================================================= ABOUT */
function initAbout() {
  const big = $('#aboutBig');
  big.innerHTML = big.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
  gsap.to($$('.w', big), { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: big, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  $('#expList').innerHTML = EXPERIENCE.map((e) => `<li><span class="mono">${e.when}</span><div><strong>${e.role}</strong><em>${e.org}</em><p>${e.note}</p></div></li>`).join('');
  $('#toolsGrid').innerHTML = TOOLS.map(([a, b]) => `<div class="tool"><b>${a}</b><span class="mono">${b}</span></div>`).join('');
  gsap.from('.tool', { y: 60, opacity: 0, rotate: 6, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.tools', start: 'top 85%' } });
  gsap.from('.about__exp li', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.about__exp', start: 'top 80%' } });
  // tilt card
  const card = $('.about__photo');
  if (!isTouch) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      gsap.to(card, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 16, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 16, transformPerspective: 900, duration: 0.5 });
    });
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8 }));
  }
  const clock = $('#clock');
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST — Bangalore';
  };
  tick(); setInterval(tick, 1000);
}

/* ================================================= SHOWREEL */
function initShowreel() {
  const frame = $('#reelFrame'), v = $('#showreelVideo');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.showreel', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  tl.to(frame, { width: () => (isMobile() ? '100vw' : '100vw'), borderRadius: 0, ease: 'none' }, 0)
    .to('.showreel__text span:first-child', { xPercent: -60, opacity: 0, ease: 'none' }, 0)
    .to('.showreel__text span:last-child', { xPercent: 60, opacity: 0, ease: 'none' }, 0);
  ScrollTrigger.create({ trigger: '.showreel', start: 'top 80%', end: 'bottom top', onToggle: (s) => (s.isActive ? v.play().catch(() => {}) : v.pause()) });
  frame.addEventListener('click', () => { v.muted = !v.muted; frame.dataset.cursor = v.muted ? 'Sound' : 'Mute'; setCursor(frame.dataset.cursor); });
  frame.dataset.cursor = 'Sound';
}

/* ================================================= CONTACT spotlight reveal */
function initContact() {
  const el = $('#contactReveal'), mask = $('.contact__big--mask', el);
  const s = { r: 0, x: 0, y: 0 };
  el.addEventListener('pointerenter', () => gsap.to(s, { r: isTouch ? 140 : 190, duration: 0.6, ease: 'expo.out' }));
  el.addEventListener('pointerleave', () => gsap.to(s, { r: 0, duration: 0.5 }));
  el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); s.x = e.clientX - r.left; s.y = e.clientY - r.top; });
  let cx = 0, cy = 0;
  gsap.ticker.add(() => {
    cx += (s.x - cx) * 0.15; cy += (s.y - cy) * 0.15;
    mask.style.setProperty('--x', cx + 'px'); mask.style.setProperty('--y', cy + 'px'); mask.style.setProperty('--r', s.r + 'px');
  });
  gsap.from('.contact__big--base', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
}

/* ================================================= MODAL */
function initModal() {
  const modal = $('#modal'), panel = $('#modalPanel'), bg = $('.modal__bg');
  let current = 0;
  function render(i) {
    current = i;
    const p = PROJECTS[i];
    $('#mCat').textContent = p.cat;
    $('#mTitle').textContent = p.title;
    $('#mClient').textContent = p.client;
    $('#mDesc').textContent = p.desc;
    $('#mTags').innerHTML = p.tags.map((t) => `<span>${t}</span>`).join('');
    $('#mMedia').innerHTML = p.media.map((m, k) => {
      if (m.type === 'video') return `<div class="${k === 0 ? 'm-wide' : ''}"><video src="${m.src}" poster="${m.poster}" controls playsinline preload="metadata" ${k === 0 ? 'autoplay muted loop' : ''}></video></div>`;
      if (m.type === 'embed') return `<div class="m-wide"><div class="embed"><iframe src="${m.src}" allow="autoplay; fullscreen" allowfullscreen loading="lazy" title="${p.title}"></iframe></div><a class="embed-link mono u-link" href="${m.link}" target="_blank" rel="noopener"><span>Watch on Behance</span><span>↗</span></a></div>`;
      return `<div><img src="${m.src}" alt="${p.title} — ${p.client}" loading="lazy"></div>`;
    }).join('');
    const nx = PROJECTS[(i + 1) % PROJECTS.length];
    $('#mNextTitle').textContent = nx.title;
    panel.scrollTop = 0;
    bindCursor(panel);
    gsap.from($$('#mMedia > *'), { y: 80, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', delay: 0.3 });
    gsap.from('#mTitle', { yPercent: 40, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.15 });
  }
  function open(i) {
    render(i);
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    lenis.stop();
    gsap.to(bg, { opacity: 1, duration: 0.5 });
    gsap.fromTo(panel, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'expo.inOut' });
  }
  function close() {
    setCursor(null);
    $$('video', panel).forEach((v) => v.pause());
    gsap.to(bg, { opacity: 0, duration: 0.5 });
    gsap.to(panel, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onComplete: () => {
      modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); $('#mMedia').innerHTML = ''; lenis.start();
    } });
  }
  $('#modalClose').addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  $('#mNext').addEventListener('click', () => {
    gsap.to(panel, { opacity: 0, duration: 0.3, onComplete: () => { render((current + 1) % PROJECTS.length); gsap.to(panel, { opacity: 1, duration: 0.4 }); } });
  });
  return open;
}

/* ================================================= scroll reveals */
function initReveals() {
  $$('.reveal-title').forEach((h) => {
    gsap.from($$('.char', h), { yPercent: 110, rotate: 8, opacity: 0, stagger: 0.025, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });
  // marquee driven by scroll velocity
  const track = $('#marq1');
  track.innerHTML += track.innerHTML;
  let x = 0, dir = -1;
  lenis.on('scroll', ({ direction }) => { if (direction) dir = direction > 0 ? -1 : 1; });
  gsap.ticker.add(() => {
    const v = Math.abs(lenis.velocity || 0);
    x += dir * (0.6 + v * 0.25);
    const w = track.scrollWidth / 2;
    if (x < -w) x += w; if (x > 0) x -= w;
    track.style.transform = `translateX(${x}px) skewX(${gsap.utils.clamp(-10, 10, (lenis.velocity || 0) * -0.4)}deg)`;
  });
  gsap.to('.vf', { scale: 0.92, borderRadius: 28, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.va__name', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.va__row', { opacity: 0, y: -30, ease: 'none', scrollTrigger: { trigger: '#hero', start: '10% top', end: '50% top', scrub: true } });
}

/* ================================================= BOOT */
const vfReady = initViewfinder();
const openModal = initModal();
const rollReady = initRoll(openModal);
initIndex(openModal);
initReels();
initAbout();
initShowreel();
initContact();
initReveals();
bindCursor();
bindMagnetic();

// loader
(async function boot() {
  const num = $('#loaderNum'), bar = $('#loaderBar'), words = $$('.loader__words span');
  const prog = { v: 0 };
  let real = 0;
  const assets = [rollReady, vfReady, document.fonts ? document.fonts.load('900 100px "Inter Tight"') : Promise.resolve()];
  assets.forEach((p) => p.then(() => (real += 1 / assets.length)));
  const minTime = reduced ? 300 : 1900;
  const t0 = performance.now();
  await new Promise((res) => {
    const loop = () => {
      const timeP = Math.min((performance.now() - t0) / minTime, 1);
      const target = Math.min(timeP, 0.2 + real * 0.8);
      prog.v += (target - prog.v) * 0.12;
      const pct = Math.round(prog.v * 100);
      num.textContent = pct; bar.style.width = pct + '%';
      words.forEach((w, i) => w.classList.toggle('on', prog.v > i / words.length));
      if (pct >= 100 || performance.now() - t0 > 9000) return res();
      requestAnimationFrame(loop);
    };
    loop();
  });
  num.textContent = 100; bar.style.width = '100%';
  const tl = gsap.timeline();
  tl.to('.loader__count, .loader__bar, .loader__words, .loader__grid', { yPercent: -40, opacity: 0, duration: 0.6, ease: 'expo.in' })
    .to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
    .add(() => { document.body.classList.remove('is-loading'); $('#name').classList.add('in'); }, '-=0.5')
    .from('.vf', { clipPath: 'inset(50% 0 50% 0 round 14px)', duration: 1.4, ease: 'expo.inOut' }, '<')
    .from('.va__row > *, .nav', { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out' }, '-=0.9')
    .add(() => {
      document.body.classList.remove('is-loading');
      $('#loader').style.display = 'none';
      lenis.start();
      ScrollTrigger.refresh();
    });
})();
