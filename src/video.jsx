import { useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL || './';
const src = (name, ext) => `${BASE}assets/video/${name}.${ext}`;

// True when the visitor wants stillness: OS reduced-motion, the site's own Motion toggle, or Data Saver.
const still = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.classList.contains('motion-disabled') ||
  !!(navigator.connection && navigator.connection.saveData);

/**
 * A silent, looping video that behaves like part of the page's atmosphere.
 *  - loads only when near the viewport, plays only while visible, pauses when the tab is hidden
 *  - fades in over the existing still image (which stays as the poster / fallback)
 *  - obeys the "Stillness" toggle, prefers-reduced-motion and Data Saver
 *  - hover: on mouse devices, plays only while its card is hovered or focused
 *    (touch devices fall back to playing while the card is on screen)
 */
export function LoopVideo({ name, hover = false, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const fine = matchMedia('(pointer:fine)').matches;
    const host = hover && fine ? v.closest('a,article,.world-card,.dispatch-card') : null;
    let near = false, seen = false, hot = !host, attached = false;

    const attach = () => {
      if (attached) return; attached = true;
      v.src = src(name, 'mp4'); v.load();
    };
    const sync = () => {
      const go = near && seen && hot && !document.hidden && !still();
      if (go) { attach(); const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else if (attached) v.pause();
    };

    const ioNear = new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near && (!host || hot)) attach(); sync(); }, { rootMargin: '300px' });
    const ioSeen = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }, { threshold: 0.05 });
    ioNear.observe(v); ioSeen.observe(v);

    const onVis = () => sync();
    document.addEventListener('visibilitychange', onVis);
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const on = () => { hot = true; sync(); }, off = () => { hot = false; sync(); };
    if (host) {
      host.addEventListener('pointerenter', on); host.addEventListener('pointerleave', off);
      host.addEventListener('focusin', on); host.addEventListener('focusout', off);
    }
    const playing = () => v.classList.add('is-playing');
    v.addEventListener('playing', playing);

    return () => {
      ioNear.disconnect(); ioSeen.disconnect(); mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      v.removeEventListener('playing', playing);
      if (host) { host.removeEventListener('pointerenter', on); host.removeEventListener('pointerleave', off); host.removeEventListener('focusin', on); host.removeEventListener('focusout', off); }
      v.pause(); v.removeAttribute('src'); v.load();
    };
  }, [name, hover]);

  return (
    <video
      ref={ref}
      className={`lv ${className}`}
      poster={src(name, 'jpg')}
      muted loop playsInline preload="none"
      disablePictureInPicture
      aria-hidden="true" tabIndex={-1}
    />
  );
}
