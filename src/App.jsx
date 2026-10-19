import { useEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, NavLink, Link, useLocation, useParams } from 'react-router-dom';
import { LINKS, PROJECTS, SKILLS } from './data.js';
import { FX, PortalZoom } from './fx.jsx';
import { LoopVideo } from './video.jsx';
import { Symbols } from './symbols.jsx';
import { Presences } from './presences.jsx';
import { PortalPage } from './portal.jsx';
import { DOORS, DOOR_VIDEO } from './doors.js';
import { playCosmicSound, enableCosmicAudio, disableCosmicAudio, setCosmicWorld } from './sound.js';


const BASE = import.meta.env.BASE_URL || './';
const asset = (path) => `${BASE}${path.replace(/^\//, '')}`;
const WorldContext = createContext(null);
const worlds = [
  { id:'solar-coast', video:'solar-coast', name:'The Solar Coast', eyebrow:'01 / ABUNDANCE & ARRIVAL', cue:'A golden shore that remembers every version of you.', copy:'A horizon made of liquid gold, distant suns, and the quiet certainty that there is more ahead. Follow the red thread toward what is becoming possible.', image:'assets/worlds/solar.jpg', tone:'solar', glyph:'☼', fact:'The sun does not ask permission to rise.', destination:'/work' },
  { id:'moon-ocean', video:'moon-ocean', name:'The Moon Ocean', eyebrow:'02 / MEMORY & TRANSFORMATION', cue:'A silver sea where the past becomes a constellation.', copy:'Moonlight slips through the water. Small things surface, dissolve, and return as something else. Stay long enough and the ocean begins to answer.', image:'assets/worlds/moon.jpg', tone:'moon', glyph:'◔', fact:'Not everything lost is asking to be found.', destination:'/archive' },
  { id:'angel-veil', video:'angel-veil', name:'The Angel Veil', eyebrow:'03 / PROTECTION & RENEWAL', cue:'A threshold made from haze, light, and almost-wings.', copy:'This is a place of soft edges and private courage. The guide drifts through it like a thought you nearly remember: present, gentle, never in command.', image:'assets/worlds/veil.jpg', tone:'veil', glyph:'✧', fact:'You are allowed to become someone new.', destination:'/invitation' },
  { id:'living-tree', video:'living-tree', name:'The Living Tree', eyebrow:'04 / GROWTH & KNOWLEDGE', cue:'Roots become circuits; branches become living data.', copy:'A growing network of things learned, things built, and things still becoming. Biology, code, observation, and craft share the same root system here.', image:'assets/worlds/tree.svg', tone:'tree', glyph:'⌘', fact:'Growth is a pattern, not a straight line.', destination:'/archive' },
  { id:'overflow', video:'overflow', name:'The Overflow', eyebrow:'05 / CREATION & RECEIVING', cue:'A vessel that holds more than it was made to hold.', copy:'A little gold vessel catches a star, then a river, then a whole impossible sky. Ideas are not meant to stay abstract forever.', image:'assets/worlds/overflow.jpg', tone:'overflow', glyph:'♧', fact:'Let the beautiful thing become real.', destination:'/workshop' },
  { id:'garden-of-becoming', video:'garden', name:'Garden of Becoming', eyebrow:'06 / RENEWAL & BLOOM', cue:'A violet garden that only blooms in the dark.', copy:'Nothing here is rushed. A single flower opens petal by petal while soft light drifts through the dark, proof that becoming is quiet, private and entirely yours.', image:'assets/worlds/garden.jpg', tone:'garden', glyph:'❀', fact:'You do not bloom on anyone else\'s schedule.', destination:'/portal' },
];
const social = [
  {name:'Instagram',handle:'@cvntcourtiffai',href:LINKS.ig,detail:'Visual diary · style · everyday fragments',glyph:'◎'},
  {name:'TikTok',handle:'@secsisani',href:LINKS.tt1,detail:'Skincare · fashion · creator experiments',glyph:'♪'},
  {name:'TikTok',handle:'@_iph_fi',href:LINKS.tt2,detail:'Another little corner of the internet',glyph:'⌁'},
];

function Stars({ density = 90 }) {
  const canvas = useRef(null);
  const { motion } = useContext(WorldContext);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext('2d', { alpha:true });
    if (!ctx) return;
    let width=0, height=0, raf=0, visible=true, pointer={x:-1000,y:-1000};
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const count = Math.max(28, Math.round(density * (mobile ? .48 : 1)));
    let seed = 92741;
    const random = () => { seed=(seed*16807)%2147483647; return (seed-1)/2147483646; };
    const stars = Array.from({length:count},()=>({x:random(),y:random(),r:.35+random()*1.45,a:.18+random()*.65,phase:random()*6.28,drift:.05+random()*.2}));
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,1.7);width=node.clientWidth;height=node.clientHeight;node.width=Math.max(1,width*dpr);node.height=Math.max(1,height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    const move=e=>{const rect=node.getBoundingClientRect();pointer={x:e.clientX-rect.left,y:e.clientY-rect.top};};
    const draw=(t=0)=>{
      ctx.clearRect(0,0,width,height);
      stars.forEach((s,i)=>{
        const twinkle = motion && !reduced ? .72+.28*Math.sin(t*.0007+s.phase) : .86;
        let x=s.x*width, y=s.y*height;
        if(motion && !reduced){x += Math.sin(t*.00012+s.phase)*7; y += Math.cos(t*.0001+s.phase)*5;}
        const dx=x-pointer.x,dy=y-pointer.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(motion && dist<90 && dist>0){x += dx/dist*(90-dist)*.055;y += dy/dist*(90-dist)*.055;}
        ctx.globalAlpha=s.a*twinkle;ctx.fillStyle=i%11===0?'#d6b7ff':i%7===0?'#e7b8b4':'#f2ebdd';ctx.beginPath();ctx.arc(x,y,s.r,0,Math.PI*2);ctx.fill();
        if(i%19===0){ctx.globalAlpha=.13;ctx.strokeStyle='#d6b7ff';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+14,y-8);ctx.stroke();}
      });
      ctx.globalAlpha=1;
      if(visible && motion && !reduced) raf=requestAnimationFrame(draw);
    };
    const visibility=()=>{visible=!document.hidden;cancelAnimationFrame(raf);if(visible&&motion&&!reduced)raf=requestAnimationFrame(draw);else draw(0);};
    resize(); draw(0);
    node.addEventListener('pointermove',move,{passive:true});window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);
    return()=>{cancelAnimationFrame(raf);node.removeEventListener('pointermove',move);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);};
  },[density,motion]);
  return <canvas className="starfield" ref={canvas} aria-hidden="true"/>;
}

function EyeSymbol(){
  return <svg viewBox="0 0 80 48" width="38" height="24" aria-hidden="true"><path d="M3 24Q40 -5 77 24Q40 53 3 24Z" fill="#f4eee6"/><ellipse cx="40" cy="24" rx="24" ry="19" fill="#1c4a9c"/><ellipse cx="40" cy="24" rx="16" ry="13" fill="#f4eee6"/><ellipse cx="40" cy="24" rx="10" ry="9" fill="#39a9d6"/><circle cx="40" cy="24" r="5.5" fill="#07111f"/><circle cx="42" cy="21" r="2" fill="#fff"/></svg>;
}

function CosmicPresence(){
  const points = useMemo(()=>Array.from({length:135},(_,i)=>{
    const angle=(i/135)*Math.PI*2, row=(i%45)/45;
    const bands=[{cx:50,cy:16,rx:11,ry:11},{cx:50,cy:37,rx:17,ry:12},{cx:50,cy:58,rx:20,ry:18},{cx:50,cy:80,rx:13,ry:17}];
    const b=bands[Math.min(3,Math.floor(i/34))];
    const jitter=Math.sin(i*2.23)*4;
    return {x:b.cx+Math.cos(angle)*b.rx*(.55+row*.8)+jitter*.12,y:b.cy+Math.sin(angle)*b.ry*(.55+row*.8),r:.35+(i%5)*.17,delay:(i%19)*-.22};
  }),[]);
  return <div className="cosmic-presence" aria-label="A human silhouette made from stars, haze and light" role="img">
    <div className="presence-halo"/><div className="presence-face"><img src={asset('assets/portraits/face.jpg')} alt="Portrait of Epeke Vuyisani" /></div>
    <svg className="presence-body" viewBox="0 0 100 105" aria-hidden="true">
      <defs><radialGradient id="body-haze"><stop offset="0" stopColor="#e9d3ff" stopOpacity=".6"/><stop offset=".55" stopColor="#9470d8" stopOpacity=".16"/><stop offset="1" stopColor="#8a72bd" stopOpacity="0"/></radialGradient></defs>
      <ellipse cx="50" cy="54" rx="40" ry="48" fill="url(#body-haze)"/>
      {points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={p.r} fill={i%8===0?'#d8b7ff':i%5===0?'#e7c58d':'#f2ebdd'} opacity={.28+(i%7)*.09} style={{animationDelay:`${p.delay}s`}}/>)}
      <path d="M23 44 Q50 29 77 44 M19 58 Q50 43 81 58 M26 73 Q50 62 74 73" stroke="#d6b7ff" strokeOpacity=".35" strokeWidth=".3" fill="none"/>
    </svg>
    <span className="presence-caption mono">FACE / MEMORY · BODY / COSMOS</span>
  </div>;
}

function Guide(){
  const nodeRef=useRef(null);
  const {motion}=useContext(WorldContext);
  const location=useLocation();
  const [coarse]=useState(()=>!window.matchMedia('(pointer:fine)').matches);
  const [bubble,setBubble]=useState(false);
  const HINTS={'/':'Scroll to drift through the universe. Tap a world to step inside.','/archive':'The archive: tabs hold the story, the skills and what is in progress.','/work':'Each point of light is something I made. Open the live portfolios.','/ugc':'Creator work, soft focus and sharp feeling.','/workshop':'Tell me what you want to make; we will figure out the shape.','/social':'Little windows into other worlds.','/invitation':'Pick the thread closest to you and leave a signal.','/portal':'Ten doors, one universe. Tap a door, then tap again to enter.'};
  const hint=location.pathname.startsWith('/world/')?'Wake the world, then find a fragment.':(HINTS[location.pathname]||'Still here.');
  useEffect(()=>{setBubble(false);},[location.pathname]);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node=nodeRef.current;if(!node)return;
    if(coarse){
      const place=(x,y)=>{node.style.transform=`translate3d(${x}px,${y}px,0)`;};
      let cur={x:window.innerWidth-70,y:window.innerHeight*.62};place(cur.x,cur.y);
      const targetAtScroll=()=>{const sy=window.scrollY;return {x:window.innerWidth-66-(.5+.5*Math.sin(sy/340))*Math.min(window.innerWidth*.4,150),y:window.innerHeight*.62+Math.sin(sy/210)*30};};
      if(!motion||reduced){const update=()=>{const t=targetAtScroll();place(t.x,t.y);};window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};}
      let raf=0;
      const tick=()=>{const t=targetAtScroll();cur.x+=(t.x-cur.x)*.07;cur.y+=(t.y-cur.y)*.07;place(cur.x,cur.y);raf=requestAnimationFrame(tick);};
      raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
    }
    if(!motion||reduced)return;
    let raf=0, visible=false, target={x:window.innerWidth-76,y:window.innerHeight-90}, current={...target};
    const move=e=>{target={x:e.clientX+18,y:e.clientY+18};visible=true;node.style.opacity='.9';};
    const tick=()=>{current.x+=(target.x-current.x)*.08;current.y+=(target.y-current.y)*.08;if(visible)node.style.transform=`translate3d(${current.x}px,${current.y}px,0)`;raf=requestAnimationFrame(tick);};
    window.addEventListener('pointermove',move,{passive:true});raf=requestAnimationFrame(tick);
    return()=>{window.removeEventListener('pointermove',move);cancelAnimationFrame(raf);};
  },[motion,coarse]);
  const art=<svg viewBox="0 0 72 84" width="42" height="50"><defs><filter id="guide-glow"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <g fill="#f8f3ff" opacity=".4" filter="url(#guide-glow)"><path d="M31 28C10 5 1 19 9 42C17 37 24 39 32 44Z"/><path d="M41 28C62 5 71 19 63 42C55 37 48 40 40 44Z"/><circle cx="36" cy="21" r="10"/><path d="M26 34Q36 29 46 34L48 60Q36 68 24 60Z"/></g>
      <g fill="#f5f0ff" stroke="#c9aaff" strokeWidth=".7"><path className="wing wing-l" d="M31 28C10 5 1 19 9 42Q21 36 32 44Z" opacity=".6"/><path className="wing wing-r" d="M41 28C62 5 71 19 63 42Q51 36 40 44Z" opacity=".6"/><circle cx="36" cy="21" r="8"/><path d="M28 33Q36 29 44 33L47 58Q36 65 25 58Z"/><path d="M27 57L31 57L30 72L26 72ZM39 57L43 57L46 72L42 72Z"/></g>
    </svg>;
  return <div ref={nodeRef} className={`little-guide ${coarse?'mobile':''}`} aria-hidden={coarse?undefined:'true'}>
    {coarse&&bubble&&<div className="guide-bubble" role="status"><p>{hint}</p><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>↑ Back to top</button></div>}
    {coarse?<button className="guide-tap" aria-label="Ask the guide for a hint" aria-expanded={bubble} onClick={()=>setBubble(v=>!v)}>{art}</button>:art}
    <span>still here</span>
  </div>;
}

function Reveal({children,className=''}){
  const ref=useRef(null);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){node.classList.add('is-visible');return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.12});
    observer.observe(node);return()=>observer.disconnect();
  },[]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function SiteShell({children}){
  const {motion,setMotion,disturb,setDisturb,visited,soundEnabled,setSoundEnabled}=useContext(WorldContext);
  const [menuOpen,setMenuOpen]=useState(false);
  const location=useLocation();
  useEffect(()=>{window.scrollTo(0,0);setMenuOpen(false);document.title=`${location.pathname==='/'?'Epeke Vuyisani':location.pathname.split('/').filter(Boolean).slice(-1)[0].replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())+' — Epeke Vuyisani'} · The Cosmic Digital Universe`;},[location.pathname]);
  const nav=[['Observatory','/'],['Archive','/archive'],['Constellation','/work'],['Creator’s World','/ugc'],['Workshop','/workshop'],['Social Orbits','/social'],['Portal','/portal'],['Invitation','/invitation']];
  return <>
    <a className="skip-link" href="#main">Skip the portals and go to content</a>
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Epeke Vuyisani, return to Observatory"><span className="wordmark-symbol">✳</span><span>EPEKE <i>VUYISANI</i><small>THE COSMIC DIGITAL UNIVERSE</small></span></Link>
      <button className="menu-toggle" onClick={()=>setMenuOpen(v=>!v)} aria-expanded={menuOpen} aria-controls="primary-navigation">{menuOpen?'Close −':'Explore +'}</button>
      <nav id="primary-navigation" className={menuOpen?'nav-open':''} aria-label="Primary navigation">{nav.map(([label,path])=><NavLink key={path} to={path} end={path==='/'}>{label}</NavLink>)}</nav>
      <div className="header-controls"><button className="tiny-control" onClick={()=>setMotion(v=>!v)} aria-pressed={motion} title="Toggle ambient movement">{motion?'Motion ◉':'Stillness ○'}</button><button className={`tiny-control ${soundEnabled?'sound-on':''}`} onClick={()=>{if(!soundEnabled){enableCosmicAudio(window.location.hash.includes('/world/')?window.location.hash.split('/')[2]:'observatory');playCosmicSound('toggle');}else{disableCosmicAudio();}setSoundEnabled(v=>!v);}} aria-pressed={soundEnabled} title="Toggle cosmic sound effects">{soundEnabled?'Sound ◖))':'Sound off ×'}</button><button className={`tiny-control glitch-control ${disturb?'is-on':''}`} onClick={()=>setDisturb(v=>!v)} aria-pressed={disturb} title="Disturb the signal">{disturb?'Signal unstable':'Disturb signal'}</button></div>
    </header>
    <main id="main" tabIndex="-1">{children}</main>
    <footer className="site-footer"><div className="footer-top"><Link to="/" className="footer-brand">EPEKE VUYISANI <span>✳</span></Link><p>Between science, code & the cosmos.</p><Link to="/invitation" className="footer-invite">Leave a signal ↗</Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} · Made of curiosity and stardust</span><span>{visited.size} / {worlds.length} worlds visited</span><div><a href={LINKS.web} target="_blank" rel="noreferrer">Web portfolio ↗</a><a href={LINKS.ugc} target="_blank" rel="noreferrer">UGC portfolio ↗</a></div></div></footer>
    <Guide />
  </>;
}

function Observatory(){
  const {disturb,visited,setVisited,motion}=useContext(WorldContext);
  return <div className="observatory page-world">
    <section className="hero-observatory" aria-labelledby="hero-title">
      <div className="hero-image" style={{backgroundImage:`url(${asset('assets/worlds/observatory.jpg')})`}}><LoopVideo name="hero"/></div>
      <div className="hero-wash"/><Stars density={150}/>
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse-dot"/> A PERSONAL UNIVERSE · NIGERIA / EVERYWHERE</p>
        <h1 id="hero-title">I am not a <em>single</em><br/>thing.</h1>
        <p className="hero-subtitle">I build digital experiences, create visual stories, and turn curiosity into things that exist.</p>
        <p className="hero-body">A living archive of science, code, image, identity, and the strange beautiful things in between. Nothing here is quite as still as it first appears.</p>
        <div className="hero-actions"><Link to="/world/solar-coast" onClick={()=>setVisited(s=>new Set([...s,'solar-coast']))} className="button button-light">Enter the universe <span>↗</span></Link><Link to="/archive" className="text-link">Read my signal <span>→</span></Link></div>
        <div className="hero-index mono"><span>FIELD NOTES 001—∞</span><span>SCROLL TO DRIFT ↓</span></div>
      </div>
      <div className="hero-art"><CosmicPresence/><span className="solar-orb" aria-hidden="true"/><span className="lunar-orb" aria-hidden="true"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/><button className="orbit-symbol symbol-eye" onClick={()=>document.querySelector('.secret-note')?.classList.toggle('revealed')} aria-label="Reveal a hidden message"><EyeSymbol/></button><span className="orbit-symbol symbol-star">✳</span><span className="orbit-symbol symbol-moon">◔</span><div className="secret-note">The face is memory.<br/>The body is possibility.</div></div>
      <div className="hero-coordinate mono"><span>06° 15′ N</span><span>THE OBSERVATORY</span></div>
    </section>
    <PortalZoom asset={asset}/>
    <section className="manifesto section-pad"><div className="manifesto-video" aria-hidden="true"><LoopVideo name="flower"/></div>
      <Reveal className="manifesto-label"><p className="eyebrow">A SMALL DECLARATION</p><span className="giant-glyph">✳</span></Reveal>
      <Reveal className="manifesto-copy"><p className="manifesto-quote">The face is the identity.<br/><em>The body is the cosmos.</em><br/>The symbols carry the story.<br/>The website is the universe.</p><p className="muted">This place is not a template with stars pasted on. It is a map of different inner climates — built to be entered, wandered, touched, and remembered.</p></Reveal>
    </section>
    <Presences motion={motion} asset={asset}/>
    <section className="world-index section-pad" id="worlds">
      <div className="section-heading"><div><p className="eyebrow">CHOOSE A DOORWAY</p><h2>Worlds with <em>their own weather.</em></h2></div><span className="mono">{String(visited.size).padStart(2,'0')} / {String(worlds.length).padStart(2,'0')} DISCOVERED</span></div>
      <div className="world-grid">{worlds.map((w,i)=><Link to={`/world/${w.id}`} key={w.id} onClick={()=>setVisited(s=>new Set([...s,w.id]))} className={`world-card ${w.tone} ${visited.has(w.id)?'visited':''}`} style={{'--card-image':`url("${asset(w.image)}")`}}><div className="world-card-image"><LoopVideo name={w.video} hover/></div><div className="world-card-overlay"/><span className="world-number mono">0{i+1} / WORLD</span><span className="world-glyph">{w.glyph}</span><div className="world-card-copy"><p className="eyebrow">{w.eyebrow}</p><h3>{w.name}</h3><p>{w.cue}</p><span className="world-enter">{visited.has(w.id)?'Return to this world':'Enter this world'} <b>↗</b></span></div><span className="visited-mark">✳</span></Link>)}</div>
      <div className="door-heading"><p className="eyebrow">MORE DOORWAYS</p><span className="mono">PAGES THAT ARE WORLDS TOO</span></div>
      <div className="door-row">{DOORS.slice(6).map(([id,name,keys,to,glyph])=><Link key={id} to={to} className="door-card"><div className="door-art" style={{backgroundImage:`url(${asset(`assets/video/${DOOR_VIDEO[id]}.jpg`)})`}}><LoopVideo name={DOOR_VIDEO[id]} hover/></div><span className="door-glyph">{glyph}</span><b>{name}</b><small>{keys}</small></Link>)}<Link to="/portal" className="door-card door-portal"><div className="door-art" style={{backgroundImage:`url(${asset('assets/video/portal.jpg')})`}}><LoopVideo name="portal" hover/></div><span className="door-glyph">∞</span><b>The Portal</b><small>Choose your world</small></Link></div>
    </section>
    <Symbols/>
    <section className="signal-strip"><Stars density={50}/><div className="signal-inner"><p className="eyebrow">A THREAD THROUGH THE WORLDS</p><p className="signal-quote">Some things are meant to be found.<br/><em>Some things are meant to find you.</em></p><Link to="/invitation" className="button button-outline">Follow the red thread ↗</Link></div><svg className="thread-line" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 82 C180 2 230 124 420 52 S680 12 800 72 S1010 116 1210 30"/></svg></section>
    <section className="dispatches section-pad"><div className="section-heading"><div><p className="eyebrow">THINGS THAT EXIST IRL</p><h2>Signals from <em>the outside.</em></h2></div><Link to="/work" className="text-link">View the constellation →</Link></div><div className="dispatch-grid"><Link to="/work" className="dispatch-card"><div className="dispatch-art" style={{backgroundImage:`url(${asset('assets/worlds/work.jpg')})`}}><LoopVideo name="constellation" hover/></div><div><span className="mono">01 / BUILD</span><h3>Web & digital craft</h3><p>Thoughtful interfaces, portfolios, and small worlds made for the browser.</p></div></Link><Link to="/ugc" className="dispatch-card"><div className="dispatch-art" style={{backgroundImage:`url(${asset('assets/worlds/social.jpg')})`}}><LoopVideo name="talisman" hover/></div><div><span className="mono">02 / CREATE</span><h3>Beauty, fashion & story</h3><p>Real-skin creator work, details, objects, and everyday rituals.</p></div></Link><Link to="/archive" className="dispatch-card"><div className="dispatch-art" style={{backgroundImage:`url(${asset('assets/worlds/archive.jpg')})`}}><LoopVideo name="archive" hover/></div><div><span className="mono">03 / LEARN</span><h3>Science & living systems</h3><p>Biotechnology, public-health work, observation, and what growth teaches.</p></div></Link></div></section>
  </div>;
}

function WorldPage(){
  const {id}=useParams();const {setVisited,visited,disturb}=useContext(WorldContext);const [awakened,setAwakened]=useState(false);const [reveal,setReveal]=useState(false);
  const world=worlds.find(w=>w.id===id);
  useEffect(()=>{if(world)setVisited(s=>new Set([...s,world.id]));setAwakened(false);setReveal(false);},[id]);
  if(!world)return <Missing/>;
  return <section className={`world-detail ${world.tone} ${awakened?'awakened':''} ${disturb?'signal-disturbed':''}`}>
    <div className="detail-image" style={{backgroundImage:`url(${asset(world.image)})`}}><LoopVideo key={world.id} name={world.video}/></div><div className="detail-shade"/><Stars density={110}/><div className="detail-noise"/>{(id==='solar-coast'||id==='moon-ocean'||id==='invitation')&&<svg className="world-ribbon" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"><path d={id==='solar-coast'?'M-20 630 C190 500 310 690 510 580 S870 510 1220 610':id==='moon-ocean'?'M-20 690 C220 590 360 730 550 650 S900 570 1220 660':'M-20 720 C200 600 330 760 520 660 S920 580 1220 680'}/></svg>}
    <div className="detail-topline mono"><Link to="/">← OBSERVATORY</Link><span>{world.eyebrow}</span><span>WORLD {String(worlds.findIndex(w=>w.id===id)+1).padStart(2,'0')} / {String(worlds.length).padStart(2,'0')}</span></div>
    <div className="detail-content"><p className="eyebrow">A PLACE TO PAUSE</p><span className="detail-glyph">{world.glyph}</span><h1>{world.name}</h1><p className="detail-cue">{world.cue}</p><p className="detail-copy">{world.copy}</p><div className="detail-actions"><button className="button button-light" onClick={()=>setAwakened(v=>!v)}>{awakened?'Let the world rest':'Wake the world'} <span>{awakened?'◌':'✧'}</span></button><button className="button button-outline" onClick={()=>setReveal(v=>!v)}>{reveal?'Close the fragment':'Find a fragment'} <span>⌁</span></button></div>
      {reveal&&<div className="found-fragment" role="status"><span className="mono">FRAGMENT RECOVERED</span><p>{world.fact}</p><span className="fragment-spark">✳</span></div>}
      <div className="detail-destination"><span className="mono">THIS WORLD CONNECTS TO</span><Link to={world.destination}>{world.destination==='/work'?'The Constellation':world.destination==='/archive'?'The Archive':world.destination==='/workshop'?'The Workshop':world.destination==='/portal'?'The Portal':'The Invitation'} ↗</Link>{id==='living-tree'&&<Link to="/work">Follow a branch to my work ↗</Link>}</div></div>
    <div className="detail-bottom mono"><span>{visited.size} WORLDS HAVE LEFT A TRACE</span><span>MOVE SLOWLY. NOTICE MORE.</span></div>
    <nav className="world-switcher" aria-label="Other worlds">{worlds.filter(w=>w.id!==id).map(w=><Link key={w.id} to={`/world/${w.id}`} aria-label={`Travel to ${w.name}`} title={w.name} className={visited.has(w.id)?'visited':''}>{w.glyph}</Link>)}</nav>
  </section>;
}

function PageFrame({kicker,title,subtitle,children,theme='archive',video}){
  return <section className={`content-page content-${theme}`}><div className="content-backdrop">{video&&<LoopVideo name={video}/>}</div><div className="content-veil"/><Stars density={75}/><div className="content-inner"><div className="content-intro"><p className="eyebrow">{kicker}</p><h1>{title}</h1>{subtitle&&<p className="content-subtitle">{subtitle}</p>}</div>{children}</div></section>;
}

function Archive(){
  const [open,setOpen]=useState('story');
  const tabs=[['story','The signal'],['skills','Things I can do'],['timeline','In progress']];
  return <PageFrame kicker="THE PERSONAL ARCHIVE / 001" title={<>A person is a <em>living system.</em></>} subtitle="Notes from a life still in motion — what I study, what I make, what I am learning to become." theme="archive" video="archive">
    <div className="archive-layout"><aside className="archive-portrait"><div className="portrait-frame"><img src={asset('assets/portraits/archive-portrait.jpg')} alt="Epeke Vuyisani, portrait"/><span className="portrait-index mono">FIG. 01 / PRESENT TENSE</span></div><p className="portrait-caption">A body in the world. A mind in many places.</p><a className="button button-outline" href={asset('cv.pdf')} download>Download CV <span>↓</span></a></aside>
      <div className="archive-main"><div className="archive-tabs" role="tablist" aria-label="Archive sections">{tabs.map(([key,label])=><button key={key} role="tab" aria-selected={open===key} className={open===key?'selected':''} onClick={()=>setOpen(key)}>{label}</button>)}</div>
        {open==='story'&&<div className="archive-panel" role="tabpanel"><p className="eyebrow">CURRENT TRANSMISSION</p><h2>Between the living world and the digital one.</h2><p>I am a Nigerian Biotechnology student, web developer, and UGC creator. I like systems — biological, visual, social — and the moment when a complicated idea becomes something people can actually use or feel.</p><p>My work with a public-health programme has taught me the quiet importance of listening, documentation, trust, and care. My creative work gives those same instincts another language: interfaces, images, motion, and stories.</p><div className="archive-facts"><div><span className="mono">BASED IN</span><b>Nigeria</b></div><div><span className="mono">STUDYING</span><b>Biotechnology</b></div><div><span className="mono">MAKING</span><b>Digital experiences</b></div></div></div>}
        {open==='skills'&&<div className="archive-panel" role="tabpanel"><p className="eyebrow">TOOLS / PRACTICES / CURIOSITIES</p><h2>A toolkit that keeps growing.</h2><p>Not a claim to know everything — a map of the things I use, practice, and want to get better at.</p><div className="skill-cloud">{SKILLS.map((skill,i)=><span key={skill} style={{'--skill-i':i}}>{skill}</span>)}{['React basics','Responsive design','Visual storytelling','M&E documentation','Data organisation','Creative direction'].map((skill,i)=><span key={skill} className="skill-extra">{skill}</span>)}</div></div>}
        {open==='timeline'&&<div className="archive-panel" role="tabpanel"><p className="eyebrow">NOT A FINISHED STORY</p><h2>Things currently taking shape.</h2><ol className="timeline"><li><span className="mono">NOW</span><div><b>Build a more expressive web practice</b><p>Interactive interfaces, visual systems, and a body of work that feels like mine.</p></div></li><li><span className="mono">ONGOING</span><div><b>Grow as a biotechnology professional</b><p>Research literacy, data quality, documentation, and the relationship between science and people.</p></div></li><li><span className="mono">NEXT</span><div><b>Make creative work sustainable</b><p>Develop creator partnerships and useful digital services without losing the joy of making.</p></div></li></ol></div>}
      </div></div>
  </PageFrame>;
}

function Work(){
  const projects=[...PROJECTS.filter(p=>p.name!=='UGC portfolio PDF (A4)'),{name:'The Cosmic Digital Universe',cat:'Creative technology',status:'experiment',desc:'An evolving, interactive digital world made from atmosphere, symbols, and small discoveries.',tools:'React · CSS · SVG · Canvas',link:null}];
  return <PageFrame kicker="THE CONSTELLATION / 002" title={<>Things I have <em>made real.</em></>} subtitle="A few points of light: web projects, creator work, experiments, and the skills still forming between them." theme="work" video="constellation">
    <div className="featured-links"><a href={LINKS.web} target="_blank" rel="noreferrer" className="featured-link"><span className="featured-art" style={{backgroundImage:`url(${asset('assets/worlds/work.jpg')})`}}/><span className="featured-meta"><span className="eyebrow">LIVE PORTFOLIO / WEB</span><b>Web development portfolio</b><span>Open the working portfolio ↗</span></span></a><a href={LINKS.ugc} target="_blank" rel="noreferrer" className="featured-link"><span className="featured-art featured-ugc" style={{backgroundImage:`url(${asset('assets/worlds/solar.jpg')})`}}/><span className="featured-meta"><span className="eyebrow">LIVE PORTFOLIO / CREATOR</span><b>UGC & visual storytelling</b><span>Open the creator portfolio ↗</span></span></a></div>
    <div className="project-heading"><p className="eyebrow">THE WORKING CONSTELLATION</p><span className="mono">STATUS IS PART OF THE STORY</span></div><div className="project-list">{projects.map((p,i)=><article className="project-row" key={p.name}><span className="project-index mono">0{i+1}</span><div><p className="eyebrow">{p.cat}</p><h2>{p.name}</h2><p>{p.desc}</p><span className="project-tools mono">{p.tools}</span></div><span className={`status-tag ${p.status}`}>{p.status==='wip'?'In progress':p.status==='completed'?'Live / complete':p.status==='experiment'?'Experiment':p.status}</span>{p.link&&<a href={p.link} target="_blank" rel="noreferrer" className="project-open">Open ↗</a>}</article>)}</div>
    <div className="work-note"><span>✳</span><p>Have an idea that needs a digital home, a visual story, or a curious mind?</p><Link to="/invitation" className="text-link">Let’s make something →</Link></div>
  </PageFrame>;
}

function UGC(){
  return <PageFrame kicker="THE CREATOR'S WORLD / 003" title={<>Ordinary rituals, <em>made luminous.</em></>} subtitle="Skincare, fashion, fragrance, accessories, and the little details that make a product feel like part of a life." theme="ugc" video="talisman">
    <div className="ugc-intro"><div><p className="eyebrow">CREATOR NOTES / 01</p><h2>Real skin. Intentional detail. A little dream logic.</h2><p>I create UGC and visual stories with a warm, personal, editorial feel. The goal is not to make everyday life look unreachable — it is to make the right details impossible to ignore.</p><a href={LINKS.ugc} target="_blank" rel="noreferrer" className="button button-light">Explore my UGC portfolio ↗</a></div><div className="ugc-visual"><img src={asset('assets/portraits/portrait-fragment.jpg')} alt="Portrait fragment from the creator's visual world"/><div className="ugc-sticker sticker-one">SOFT FOCUS<br/>SHARP FEELING</div><div className="ugc-sticker sticker-two">MADE TO<br/>FEEL REAL ✳</div></div></div>
    <div className="ugc-pillars"><article><span>01</span><h3>Skincare & grooming</h3><p>Texture, routine, real-skin close-ups, product details.</p></article><article><span>02</span><h3>Fashion & accessories</h3><p>Outfits, jewelry, glasses, styling, and small transformations.</p></article><article><span>03</span><h3>Lifestyle & fragrance</h3><p>Objects with atmosphere; everyday moments with a point of view.</p></article></div>
    <div className="ugc-cta"><p className="eyebrow">FOR BRANDS & COLLABORATORS</p><h2>Let’s make something people <em>feel.</em></h2><Link to="/invitation" className="button button-outline">Start a conversation ↗</Link></div>
  </PageFrame>;
}

function Workshop(){
  const services=[{n:'01',title:'Websites & digital homes',desc:'Personal portfolios, landing pages, small business sites, and clean responsive experiences.',tags:'Design · Build · Publish'}, {n:'02',title:'UGC & visual storytelling',desc:'Creator-led content concepts for skincare, fashion, lifestyle, fragrance, and accessories.',tags:'Concept · Shoot · Story'}, {n:'03',title:'Creative / technical support',desc:'Content presentation, simple digital assets, documentation, and practical project support.',tags:'Structure · Detail · Delivery'}];
  return <PageFrame kicker="THE WORKSHOP / 004" title={<>Ideas are beautiful.<br/><em>Let’s give them form.</em></>} subtitle="A small workshop for people who need a digital presence, a visual story, or a thoughtful collaborator." theme="workshop" video="workshop">
    <div className="service-list">{services.map(s=><article key={s.n} className="service-row"><span className="service-number mono">{s.n}</span><div><h2>{s.title}</h2><p>{s.desc}</p><span className="service-tags mono">{s.tags}</span></div><span className="service-star">✳</span></article>)}</div>
    <div className="workshop-bottom"><div><p className="eyebrow">A NOTE ON THE PROCESS</p><h2>Clear scope. Curious mind.<br/><em>No mystery about the next step.</em></h2></div><div><p>Tell me what you are trying to make, what is already in place, and what a good result would look like. We can figure out the shape of the work together.</p><Link to="/invitation" className="button button-light">Tell me about your idea ↗</Link></div></div>
  </PageFrame>;
}

function Social(){
  return <PageFrame kicker="SOCIAL ORBITS / 005" title={<>Little windows into <em>other worlds.</em></>} subtitle="Follow the work as it changes shape — from everyday rituals and style to experiments, images, and things in progress." theme="social">
    <div className="social-layout"><div className="social-art"><img src={asset('assets/worlds/social.jpg')} alt="Cosmic light moving through a dark field"/><LoopVideo name="social"/><span className="social-art-label mono">SIGNAL IS OUT THERE ↗</span></div><div className="social-list">{social.map((s,i)=><a href={s.href} key={s.handle} target="_blank" rel="noreferrer" className="social-row"><span className="social-glyph">{s.glyph}</span><span><span className="eyebrow">{s.name} / 0{i+1}</span><b>{s.handle}</b><small>{s.detail}</small></span><span className="social-arrow">↗</span></a>)}</div></div>
    <div className="social-footnote"><span className="mono">NO ALGORITHM CAN HOLD THE WHOLE STORY.</span><p>The website is the home base. Everything else is a window.</p></div>
  </PageFrame>;
}

function Invitation(){
  const options=[['Web project','A website, portfolio, or digital experience.','Website enquiry','Hello Epeke, I would like to discuss a web project.','↗'],['UGC / creator partnership','A campaign, product story, or content collaboration.','UGC enquiry','Hello Epeke, I would like to discuss a UGC campaign.','✳'],['Work & opportunities','Employment, internships, or a thoughtful collaboration.','Opportunity enquiry','Hello Epeke, I would like to discuss an opportunity.','⌁']];
  return <section className="invitation-page"><div className="invitation-image" style={{backgroundImage:`url(${asset('assets/worlds/invite.jpg')})`}}><LoopVideo name="portal"/></div><div className="invitation-overlay"/><Stars density={120}/><div className="invitation-layout"><div className="invitation-copy"><p className="eyebrow">THE INVITATION / LAST DOOR, FIRST STEP</p><h1>Leave a <em>signal.</em></h1><p className="invitation-lead">Every good thing starts with a message, a question, or an idea that refuses to leave you alone.</p><p className="invitation-note">Choose the thread that feels closest. You do not need a perfect brief — just a starting point.</p><div className="contact-direct"><a href={LINKS.mail}>epekevuyisani@gmail.com ↗</a><a href={LINKS.wa} target="_blank" rel="noreferrer">WhatsApp / {LINKS.phone} ↗</a></div></div><div className="invitation-options">{options.map(([title,desc,subject,message,glyph],i)=><article key={title} className="invitation-option"><span className="option-number mono">0{i+1}</span><span className="option-glyph">{glyph}</span><div><h2>{title}</h2><p>{desc}</p><div className="option-links"><a href={`${LINKS.mail}?subject=${encodeURIComponent(subject)}`}>Email me ↗</a><a href={`${LINKS.wa}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></div></div></article>)}</div></div><div className="invitation-coordinate mono"><span>OPEN CHANNEL</span><span>NO NEED TO KNOW THE WHOLE MAP</span></div></section>;
}

function PortalWrap(){const {visited,motion}=useContext(WorldContext);return <PortalPage visited={visited} motion={motion} asset={asset}/>;}
function Missing(){return <PageFrame kicker="SIGNAL LOST / 404" title={<>A little off the <em>map.</em></>} subtitle="This doorway does not seem to exist yet. The universe is still expanding." theme="archive" video="flower"><Link to="/" className="button button-light">Return to the Observatory ↗</Link></PageFrame>;}
function ScrollReset(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);},[pathname]);return null;}
function CosmicSoundscape(){
  const {pathname}=useLocation();
  const {soundEnabled}=useContext(WorldContext);
  const previousPath=useRef(pathname);
  const worldId=pathname.startsWith('/world/')?pathname.split('/')[2]:'observatory';
  useEffect(()=>{
    if(soundEnabled) enableCosmicAudio(worldId); else disableCosmicAudio();
    return ()=>{ if(!soundEnabled) disableCosmicAudio(); };
  },[soundEnabled]);
  useEffect(()=>{
    const changed=previousPath.current!==pathname;
    previousPath.current=pathname;
    setCosmicWorld(worldId);
    if(soundEnabled && changed && pathname.startsWith('/world/')) playCosmicSound('portal');
  },[pathname,soundEnabled]);
  return null;
}

export default function App(){
  const [motion,setMotion]=useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [disturb,setDisturb]=useState(false);const [soundEnabled,setSoundEnabled]=useState(false);const [visited,setVisited]=useState(()=>new Set());
  useEffect(()=>{
    if(!soundEnabled) return;
    const handleSound=(event)=>{
      const target=event.target instanceof Element ? event.target.closest('a,button,[role=button]') : null;
      if(!target || target.disabled || target.getAttribute('aria-disabled')==='true' || target.closest('[data-silent-sound]')) return;
      const isNavigation=target.matches('a') || target.classList.contains('world-card') || target.classList.contains('world-switcher-link');
      playCosmicSound(isNavigation?'navigate':'click');
    };
    document.addEventListener('click',handleSound,true);
    return()=>document.removeEventListener('click',handleSound,true);
  },[soundEnabled]);
  useEffect(()=>{const stored=window.sessionStorage.getItem('epeke-visited');if(stored){try{setVisited(new Set(JSON.parse(stored)));}catch{}}},[]);
  useEffect(()=>{try{window.sessionStorage.setItem('epeke-visited',JSON.stringify([...visited]));}catch{}},[visited]);
  useEffect(()=>{document.documentElement.classList.toggle('motion-enabled',motion);document.documentElement.classList.toggle('motion-disabled',!motion);document.body.classList.toggle('signal-disturbed',disturb);return()=>{document.documentElement.classList.remove('motion-enabled','motion-disabled');document.body.classList.remove('signal-disturbed');};},[motion,disturb]);
  return <WorldContext.Provider value={{motion,setMotion,disturb,setDisturb,visited,setVisited,soundEnabled,setSoundEnabled}}><HashRouter><ScrollReset/><CosmicSoundscape/><FX/><SiteShell><Routes><Route path="/" element={<Observatory/>}/><Route path="/world/:id" element={<WorldPage/>}/><Route path="/archive" element={<Archive/>}/><Route path="/work" element={<Work/>}/><Route path="/ugc" element={<UGC/>}/><Route path="/workshop" element={<Workshop/>}/><Route path="/social" element={<Social/>}/><Route path="/portal" element={<PortalWrap/>}/><Route path="/invitation" element={<Invitation/>}/><Route path="*" element={<Missing/>}/></Routes></SiteShell></HashRouter></WorldContext.Provider>;
}
