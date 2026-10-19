import { useState } from 'react';
import { Link } from 'react-router-dom';

const G = 'url(#sg-gold)', V = 'url(#sg-violet)';
const Defs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <linearGradient id="sg-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0c0" /><stop offset="1" stopColor="#c9a25a" /></linearGradient>
      <linearGradient id="sg-violet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#efe2ff" /><stop offset="1" stopColor="#8f6bff" /></linearGradient>
      <radialGradient id="sg-blue"><stop offset="0" stopColor="#bfe8ff" /><stop offset=".6" stopColor="#3aa0e0" /><stop offset="1" stopColor="#1c4a9c" /></radialGradient>
    </defs>
  </svg>
);

const ICONS = {
  sun: () => (<g fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round"><circle cx="32" cy="32" r="9" fill={G} fillOpacity=".25" />{Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8, r1 = 14, r2 = i % 2 ? 21 : 27; return <path key={i} d={`M${32 + Math.cos(a) * r1} ${32 + Math.sin(a) * r1}L${32 + Math.cos(a) * r2} ${32 + Math.sin(a) * r2}`} />; })}</g>),
  moon: () => (<g><path d="M40 8C26 10 17 21 17 33c0 13 9 22 22 23-13-3-19-12-19-23 0-10 6-19 20-25z" fill={V} /><circle cx="46" cy="18" r="1.4" fill="#fff" /><circle cx="50" cy="30" r="1" fill="#fff" /><circle cx="44" cy="44" r="1.2" fill="#fff" /></g>),
  ribbon: () => (<g fill="none" stroke="#ff4d5e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M32 30C22 18 10 20 12 29c2 8 14 5 20 1z" fill="#ff4d5e" fillOpacity=".25" /><path d="M32 30C42 18 54 20 52 29c-2 8-14 5-20 1z" fill="#ff4d5e" fillOpacity=".25" /><path d="M32 30c-4 8-9 14-12 24M32 30c4 8 9 14 12 24" /><circle cx="32" cy="30" r="3" fill="#ff4d5e" /></g>),
  eye: () => (<g><path d="M4 32Q32 6 60 32Q32 58 4 32Z" fill="#f4eee6" /><circle cx="32" cy="32" r="14" fill="url(#sg-blue)" /><circle cx="32" cy="32" r="8" fill="#f4eee6" /><circle cx="32" cy="32" r="6" fill="#39a9d6" /><circle cx="32" cy="32" r="3.2" fill="#07111f" /><circle cx="34" cy="29.5" r="1.3" fill="#fff" /></g>),
  tree: () => (<g fill="none" stroke="#6fe3b0" strokeWidth="1.8" strokeLinecap="round"><path d="M32 54V30M32 40c-6-3-9-7-10-12M32 36c6-3 10-8 10-14M32 30c-3-5-3-10 0-14" /><circle cx="32" cy="17" r="10" stroke="none" fill="#3cae7f" fillOpacity=".5" /><circle cx="20" cy="26" r="8" stroke="none" fill="#6fe3b0" fillOpacity=".35" /><circle cx="44" cy="25" r="8" stroke="none" fill="#6fe3b0" fillOpacity=".35" /><path d="M32 54c-5 1-10 3-14 6M32 54c5 1 10 3 14 6M32 54v7" stroke={G} /></g>),
  vessel: () => (<g><path d="M18 16h28c0 14-5 22-14 24-9-2-14-10-14-24z" fill={G} fillOpacity=".85" /><path d="M32 40v10M22 54h20" stroke={G} strokeWidth="3" strokeLinecap="round" /><path d="M14 22c-4 6 0 12 6 12M50 22c4 6 0 12-6 12" fill="none" stroke={G} strokeWidth="2.4" strokeLinecap="round" /><circle cx="32" cy="10" r="1.8" fill="#fff0c0" /><path d="M26 16c2 4 4 4 6 0s4-4 6 0" fill="none" stroke="#7a4f12" strokeWidth="1.2" /></g>),
  flower: () => (<g>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="32" cy="20" rx="6" ry="14" transform={`rotate(${i * 45} 32 32)`} fill={V} fillOpacity=".55" stroke="#d9c4ff" strokeWidth=".8" />)}<circle cx="32" cy="32" r="5" fill="#ffe29a" /></g>),
  stars: () => (<g fill={G}><path d="M32 6l4.5 21.5L58 32l-21.5 4.5L32 58l-4.5-21.5L6 32l21.5-4.5z" /><path d="M50 8l1.6 5.4L57 15l-5.4 1.6L50 22l-1.6-5.4L43 15l5.4-1.6z" /><path d="M12 44l1.2 4L17 49l-3.8 1.2L12 54l-1.2-3.8L7 49l3.8-1z" /></g>),
  infinity: () => (<path d="M32 32C26 20 10 20 10 32s16 12 22 0 22-12 22 0-16 12-22 0z" fill="none" stroke={G} strokeWidth="3.2" strokeLinecap="round" />),
};

export const SYMBOLS = [
  ['sun', 'The Sun', 'Life · Power · Expansion', 'Presence without apology. The sun does not wait for permission to rise, and neither does a good idea.', '/world/solar-coast', 'Solar Coast'],
  ['moon', 'The Moon', 'Intuition · Change · Dream', 'What is seen by night. Reflection, cycles and the quiet courage to change shape.', '/world/moon-ocean', 'Moon Ocean'],
  ['ribbon', 'The Red Ribbon', 'Connection · Luck · Continuity', 'A thread that runs through every world. Follow it and it leads you back to the people and the work.', '/invitation', 'The Invitation'],
  ['eye', 'The Evil Eye', 'Protection · Awareness', 'A watchful guard. Notice more, carry less fear, and keep what matters protected.', '/world/angel-veil', 'Angel Veil'],
  ['tree', 'The Tree', 'Growth · Knowledge · Roots', 'Biology, code and craft share one root system. Growth is a pattern, not a straight line.', '/world/living-tree', 'Living Tree'],
  ['vessel', 'The Vessel', 'Receiving · Overflow · Abundance', 'Made to hold a little, and it holds a sky. Ideas are meant to spill over and become real.', '/world/overflow', 'The Overflow'],
  ['flower', 'The Flower', 'Beauty · Renewal · Transformation', 'Becoming is not loud. It opens slowly, petal by petal, in the dark.', '/world/garden-of-becoming', 'Garden of Becoming'],
  ['stars', 'The Stars', 'Guidance · Possibility · Magic', 'Points of light that make a map. Every project is a star; together they form a constellation.', '/work', 'The Constellation'],
  ['infinity', 'Infinity', 'Cycles · Unity · Eternal', 'Nothing here is finished. Every ending feeds the next beginning.', '/portal', 'The Portal'],
];

export function Symbols() {
  const [open, setOpen] = useState(0);
  const cur = SYMBOLS[open];
  return (
    <section className="symbols section-pad" aria-labelledby="symbols-title">
      <Defs />
      <div className="section-heading"><div><p className="eyebrow">THE LANGUAGE OF THIS UNIVERSE</p><h2 id="symbols-title">Symbols that <em>carry the story.</em></h2></div><span className="mono">TAP A SYMBOL</span></div>
      <div className="symbol-grid" role="tablist" aria-label="Symbols">
        {SYMBOLS.map(([id, name, keys], i) => (
          <button key={id} role="tab" aria-selected={open === i} className={`symbol-chip sym-${id} ${open === i ? 'on' : ''}`} onClick={() => setOpen(i)} onMouseEnter={() => matchMedia('(pointer:fine)').matches && setOpen(i)}>
            <span className="symbol-orb"><img src={`./assets/symbols/${id}.jpg`} alt="" loading="lazy" /></span>
            <b>{name}</b><small className="mono">{keys.split(' · ')[0]}</small>
          </button>))}
      </div>
      <div className="symbol-detail" role="tabpanel" key={cur[0]}>
        <span className="symbol-big"><img src={`./assets/symbols/${cur[0]}.jpg`} alt="" /></span>
        <div><p className="eyebrow">{cur[2]}</p><h3>{cur[1]}</h3><p>{cur[3]}</p><Link className="text-link" to={cur[4]}>Visit {cur[5]} →</Link></div>
      </div>
    </section>
  );
}
