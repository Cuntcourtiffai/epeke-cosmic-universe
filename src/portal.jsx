import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoopVideo } from './video.jsx';
import { DOORS, DOOR_VIDEO } from './doors.js';

const Galaxy = lazy(() => import('./cosmic.jsx').then(m => ({ default: m.PortalGalaxy })));
class Boundary extends Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? null : this.props.children; }
}

export function PortalPage({ visited, motion, asset }) {
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const [on, setOn] = useState(true);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting)); io.observe(ref.current); return () => io.disconnect(); }, []);
  const still = !motion || !on || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cur = hover != null ? DOORS[hover] : null;
  return (
    <section className="portal-page" ref={ref} aria-labelledby="portal-title">
      <div className="portal-bg" style={{ backgroundImage: `url(${asset('assets/video/portal.jpg')})` }}><LoopVideo name="portal" /></div>
      <div className="portal-galaxy" aria-hidden="true"><Boundary><Suspense fallback={null}><Galaxy still={still} /></Suspense></Boundary></div>
      <div className="portal-veil" />
      <div className="portal-center">
        <p className="eyebrow">THE PORTAL / CHOOSE YOUR WORLD</p>
        <h1 id="portal-title">{cur ? cur[1] : <>Ten doors. <em>One universe.</em></>}</h1>
        <p className="portal-line">{cur ? cur[2] : 'Each world is a different expression of the same soul. Pick a door and step through.'}</p>
        {cur ? <Link className="button button-light" to={cur[3]}>Enter <span>↗</span></Link> : <span className="mono portal-hint">HOVER OR TAP A DOOR</span>}
      </div>
      <ol className="portal-orbit" onMouseLeave={() => setHover(null)}>
        {DOORS.map(([id, name, keys, to, glyph], i) => (
          <li key={id} className="portal-slot" style={{ '--a': `${i * 36}deg` }}>
            <Link to={to} className={`portal-door ${visited.has(id) ? 'visited' : ''} ${hover === i ? 'on' : ''}`} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={(e) => { if (!matchMedia('(pointer:fine)').matches && hover !== i) { e.preventDefault(); setHover(i); } }} aria-label={name}>
              <span className="portal-orb" style={{ backgroundImage: `url(${asset(`assets/video/${DOOR_VIDEO[id]}.jpg`)})` }}><b>{glyph}</b></span>
              <small className="mono">{name.replace('The ', '').toUpperCase()}</small>
            </Link>
          </li>))}
      </ol>
    </section>
  );
}
