import { Component } from 'react';
import { Link } from 'react-router-dom';


class Boundary extends Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

const PRES = [
  ['solar-sovereign', 'The Solar Sovereign', 'Presence · Expansion · Creation', '/world/solar-coast', 'Gold light, a halo of rays: the self that arrives and takes up space.'],
  ['lunar-voyager', 'The Lunar Voyager', 'Reflection · Mystery · Transformation', '/world/moon-ocean', 'Moonlit and still: the self that watches, remembers and changes.'],
  ['cyber-angel', 'The Cyber Angel', 'Protection · Guidance · Balance', '/world/angel-veil', 'Crowned in light, wings of glass: the self that protects and guides.'],
];

function GuideArt() {
  return (
    <svg viewBox="0 0 72 84" width="120" height="140" aria-hidden="true" className="guide-art">
      <defs><filter id="pg-glow"><feGaussianBlur stdDeviation="3" /></filter></defs>
      <g fill="#f8f3ff" opacity=".45" filter="url(#pg-glow)"><path d="M31 28C10 5 1 19 9 42C17 37 24 39 32 44Z" /><path d="M41 28C62 5 71 19 63 42C55 37 48 39 40 44Z" /><circle cx="36" cy="21" r="10" /><path d="M26 34Q36 29 46 34L48 60Q36 68 24 60Z" /></g>
      <g fill="#f5f0ff" stroke="#c9aaff" strokeWidth=".7"><path className="wing wing-l" d="M31 28C10 5 1 19 9 42Q21 36 32 44Z" opacity=".65" /><path className="wing wing-r" d="M41 28C62 5 71 19 63 42Q51 36 40 44Z" opacity=".65" /><circle cx="36" cy="21" r="8" /><path d="M28 33Q36 29 44 33L47 58Q36 65 25 58Z" /><path d="M27 57L31 57L30 72L26 72ZM39 57L43 57L46 72L42 72Z" /></g>
    </svg>
  );
}

function CosmicBodyStage() {
  const bodies = [
    ['solar', 'Solar Body', 'Gold, expansive, radiant'],
    ['lunar', 'Lunar Body', 'Silver-blue, calm, reflective'],
    ['angel', 'Cyber Angel Body', 'Winged, protective, luminous'],
  ];
  return <div className="cosmic-stage cosmic-painted-stage">
    {bodies.map(([kind, title, note]) => <figure className={`cosmic-painted cosmic-painted-${kind}`} key={kind}>
      <img src={`./assets/presences/cosmic-body-${kind}.jpg`} alt={`${title}, a nonphysical human silhouette formed from stars, light and cosmic mist`} loading="lazy" />
      <figcaption><b className="mono">{title}</b><span>{note}</span></figcaption>
    </figure>)}
  </div>;
}

export function Presences({ motion, asset }) {
  return (
    <section className="presences section-pad" aria-labelledby="presences-title">
      <div className="section-heading"><div><p className="eyebrow">NOT JUST CHARACTERS</p><h2 id="presences-title">The Celestial <em>Presences.</em></h2></div><span className="mono">REFLECTIONS OF THE SAME SOUL</span></div>
      <p className="presences-lead">Three states of one self, expressed through different cosmic weather, with a small guide that keeps you company.</p>
      <div className="presence-row">
        {PRES.map(([id, name, keys, to, note], i) => (
          <Link key={id} to={to} className={`presence-card pc-${id}`} style={{ '--i': i }}>
            <img src={asset(`assets/presences/${id}.jpg`)} alt={`${name}: a portrait of Epeke Vuyisani in ${id.split('-')[0]} light`} loading="lazy" width="720" height="960" />
            <span className="pc-shine" aria-hidden="true" />
            <span className="pc-caption"><b className="mono">{name.toUpperCase()}</b><small>{keys}</small><em>{note}</em></span>
          </Link>))}
        <div className="presence-card pc-guide">
          <div className="pc-guide-art"><GuideArt /></div>
          <span className="pc-caption"><b className="mono">THE GUIDE</b><small>Curiosity · Navigation · Company</small><em>Follows your cursor on desktop. On a phone it drifts down the page with you; tap it for a hint.</em></span>
        </div>
      </div>
      <div className="cosmic-head"><p className="eyebrow">THE COSMIC BODY</p><span className="mono">NONPHYSICAL · MADE OF STARS, LIGHT AND PARTICLES · ALWAYS EVOLVING</span></div>
      <CosmicBodyStage />
      <div className="cosmic-captions"><span><b className="mono">SOLAR BODY</b>Gold, expansive, radiant</span><span><b className="mono">ANGEL BODY</b>Winged, protective, luminous</span><span><b className="mono">LUNAR BODY</b>Silver-blue, calm, reflective</span></div>
    </section>
  );
}
