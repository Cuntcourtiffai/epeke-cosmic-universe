import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LoopVideo } from './video.jsx';

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-disabled');

// Immersive scroll zoom: a small aperture opens onto a world while glass panels fly past the camera.
export function PortalZoom({ asset }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current; let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = still() ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      el.style.setProperty('--p', p.toFixed(4));
      el.classList.toggle('open', p > 0.86);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    const mo = new MutationObserver(on); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const panels = [['moon-ocean', 'The Moon Ocean', 'assets/worlds/moon.jpg', '14%', '22%', .3], ['angel-veil', 'The Angel Veil', 'assets/worlds/veil.jpg', '66%', '16%', .42], ['living-tree', 'The Living Tree', 'assets/worlds/tree.svg', '60%', '60%', .54], ['overflow', 'The Overflow', 'assets/worlds/overflow.jpg', '10%', '62%', .66]];
  return (
    <section className="pz" ref={ref} aria-label="Step through the portal">
      <div className="pz-stage">
        <div className="pz-scene" style={{ backgroundImage: `url(${asset('assets/worlds/solar.jpg')})` }}><LoopVideo name="solar-coast" /></div>
        <div className="pz-ring" aria-hidden="true" />
        <p className="pz-word pz-l" aria-hidden="true">Science</p><p className="pz-word pz-r" aria-hidden="true">Cosmos</p>
        <p className="pz-hint mono">SCROLL TO STEP THROUGH ↓</p>
        <div className="pz-space">
          {panels.map(([id, name, img, x, y, o]) => (
            <Link key={id} to={`/world/${id}`} className="pz-glass" style={{ '--x': x, '--y': y, '--o': o }} tabIndex="-1">
              <span className="pz-thumb" style={{ backgroundImage: `url(${asset(img)})` }} /><span className="mono">WORLD</span><b>{name}</b>
            </Link>))}
        </div>
        <div className="pz-cta"><p className="eyebrow">THE FIRST DOORWAY</p><h2>Step through to the <em>Solar Coast.</em></h2><Link className="button button-light" to="/world/solar-coast">Enter <span>↗</span></Link></div>
      </div>
    </section>
  );
}

// Global, delegated effects: 3D hover tilt, hero cursor depth, scroll parallax, drifting fireflies.
export function FX() {
  useEffect(() => {
    const fine = matchMedia('(pointer:fine)').matches;
    const TILT = '.world-card,.dispatch-card,.featured-link,.ugc-pillars article,.pz-glass,.presence-card,.door-card';
    let cur = null;
    const reset = (t) => { if (!t) return; ['--rx', '--ry', '--tx', '--ty'].forEach(k => t.style.removeProperty(k)); };
    const cv = document.createElement('canvas'); cv.className = 'fireflies'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    const g = cv.getContext('2d'); let W = 0, H = 0, F = [], last = 0, raf = 0, dead = false;
    const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; size();
    const mk = (x, y, burst) => ({ x, y, vx: (Math.random() - .5) * (burst ? .7 : .15), vy: -(.1 + Math.random() * (burst ? .7 : .25)), r: 1.5 + Math.random() * (burst ? 3 : 2.4), life: burst ? 1 : 2 + Math.random() * 2, max: 1, ph: Math.random() * 6, h: Math.random() < .6 ? 42 : 268 });
    for (let i = 0; i < (fine ? 18 : 9); i++) { const f = mk(Math.random() * innerWidth, Math.random() * innerHeight, false); f.life = f.max = 99; F.push(f); }
    const move = (e) => {
      if (still()) return;
      const t = e.target.closest ? e.target.closest(TILT) : null;
      if (cur && cur !== t) reset(cur);
      if (t) { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.setProperty('--rx', (-y * 11).toFixed(2) + 'deg'); t.style.setProperty('--ry', (x * 13).toFixed(2) + 'deg'); t.style.setProperty('--tx', x.toFixed(3)); t.style.setProperty('--ty', y.toFixed(3)); }
      cur = t;
      const h = document.querySelector('.hero-observatory');
      if (h) { const r = h.getBoundingClientRect(); h.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); h.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); }
      if (fine && F.length < 120 && Math.random() < .55) { const f = mk(e.clientX, e.clientY, true); f.max = f.life; F.push(f); }
    };
    const par = () => { // scroll parallax on card art, via a CSS variable so it composes with hover
      document.querySelectorAll('.world-card-image').forEach(n => { const r = n.parentElement.getBoundingClientRect(); n.style.setProperty('--py', still() ? '0px' : ((r.top + r.height / 2 - innerHeight / 2) * -.09).toFixed(1) + 'px'); });
    };
    let pr = 0; const onScroll = () => { if (!pr) pr = requestAnimationFrame(() => { pr = 0; par(); }); };
    const draw = (t) => {
      if (dead) return; raf = requestAnimationFrame(draw);
      const dt = Math.min(48, t - last) / 16; last = t; g.clearRect(0, 0, W, H);
      if (still() || document.hidden) return;
      g.globalCompositeOperation = 'lighter';
      F = F.filter(f => f.life > 0);
      for (const f of F) {
        f.x += f.vx * dt + Math.sin(t / 900 + f.ph) * .18; f.y += f.vy * dt; if (f.max === 99) { if (f.y < -20) { f.y = H + 20; f.x = Math.random() * W; } } else f.life -= .016 * dt;
        const a = f.max === 99 ? .35 + .35 * Math.sin(t / 700 + f.ph) : Math.max(0, f.life / f.max);
        const gr = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5); gr.addColorStop(0, `hsla(${f.h},90%,82%,${a})`); gr.addColorStop(1, `hsla(${f.h},90%,60%,0)`);
        g.fillStyle = gr; g.beginPath(); g.arc(f.x, f.y, f.r * 5, 0, 7); g.fill();
      }
    };
    addEventListener('pointermove', move, { passive: true }); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', size); par();
    raf = requestAnimationFrame(draw);
    return () => { dead = true; cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('scroll', onScroll); removeEventListener('resize', size); cv.remove(); };
  }, []);
  return null;
}
