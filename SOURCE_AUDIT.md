# Source and implementation audit

This project deliberately prioritizes a responsive, atmospheric, 2D-first interactive experience rather than a generic 3D scene. The creative direction calls for flat-but-alive textures, surreal motion, haze, cosmic particles, separate worlds, and mobile compatibility. The visual system is implemented with React, CSS, SVG, Canvas, and browser-native interaction APIs so the site can be built as a static bundle and deployed to GitHub Pages.

## Repositories and documentation reviewed

- React Three Fiber official documentation: https://github.com/pmndrs/react-three-fiber — a powerful React renderer for Three.js, but not adopted because a WebGL-heavy scene would add complexity and shift the art direction toward 3D rather than the requested flat, tactile, interactive atmosphere.
- GSAP official repository: https://github.com/greensock/GSAP — reviewed as an animation option. This version uses CSS keyframes, IntersectionObserver, requestAnimationFrame, and Canvas directly to keep runtime dependencies and setup simple for GitHub Pages.
- Lenis official repository: https://github.com/darkroomengineering/lenis — reviewed as a smooth-scroll option. Not adopted: native scrolling, anchor navigation, and reduced-motion support are more robust for keyboard, touch, and low-power devices.
- tsParticles official repository: https://github.com/tsparticles/tsparticles — reviewed for particle systems. The project uses a small custom Canvas starfield for pointer response and reduced-motion control; it avoids adding an extra particle engine for a relatively restrained visual effect. The React wrapper surfaced in research is archived, so it was not selected as a new dependency.

## Original visual assets

The project includes the image assets supplied in the companion cosmic-universe ZIP and uses them locally under `public/assets/`. This avoids hotlinking and ensures the images are included in the GitHub Pages build. The face portrait is used as a focused identity element on the Observatory and a separate portrait is used in the Archive; the other worlds rely on environmental artwork rather than repeating the portrait everywhere.

## Interaction and accessibility decisions

- Separate routes for Observatory, five worlds, Archive, Constellation, Creator's World, Workshop, Social Orbits, and Invitation.
- HashRouter and relative asset paths for GitHub Pages project-site deployment and refresh-safe navigation.
- Interactive world awakening, discoverable text fragments, a hidden symbol message, persistent session visit tracking, responsive navigation, signal-disturbance effect, and pointer-reactive canvas stars.
- Motion toggle, `prefers-reduced-motion` support, visible focus states, skip link, semantic headings, and mobile-first layout fallbacks.
- No external images are hotlinked. Google Fonts are optional enhancements; system fallback fonts remain available.

## Deployment

The included `.github/workflows/deploy.yml` builds the site with Node 20 and deploys the `dist/` directory to GitHub Pages on pushes to `main` or manual workflow dispatch. In GitHub, set Pages source to **GitHub Actions**.
