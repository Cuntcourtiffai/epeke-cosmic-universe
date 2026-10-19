# Epeke Vuyisani — The Cosmic Digital Universe

An interactive, multi-world personal website: cosmic dreamcore, webcore textures, celestial symbolism, a red-thread motif, and a portrait-led Observatory whose body dissolves into stars and haze.

## Run locally

1. Install Node.js 20 or newer.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL Vite prints.
5. Before deploying, run `npm run build`.

## Deploy to GitHub Pages (beginner-friendly)

1. Create or open the GitHub repository where you want the website to live.
2. Upload the **contents** of this folder (the `src`, `public`, `.github`, `index.html`, `package.json`, and lock file) to the repository root. Do not upload the ZIP itself as the only file.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **GitHub Actions**.
6. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish successfully.
7. Return to **Settings → Pages** and open the published URL.

The app uses `HashRouter` and relative asset URLs, so navigation works on a repository URL such as `https://USERNAME.github.io/REPOSITORY/` without server-side rewrite configuration.

## What is included

- Observatory home with portrait/cosmic-body composition, moving star field, hidden message, red thread, and five interactive world portals.
- Five separate worlds: Solar Coast, Moon Ocean, Angel Veil, Living Tree, and Overflow.
- Archive with selectable story, skills, and current-direction panels.
- Constellation of projects, Creator's World / UGC, Workshop / services, Social Orbits, and Invitation / contact pages.
- Local artwork in `public/assets/`, local CV PDF, favicon, responsive navigation, motion toggle, signal-disturbance effect, visit tracking, and accessible motion fallbacks.
- GitHub Actions deployment workflow and source audit.

## Update your content

- Edit `src/data.js` to change contact links, portfolio links, project listings, or skills.
- Replace artwork in `public/assets/worlds/` or `public/assets/portraits/` with your own optimized images, keeping the filenames the same if you do not also update `src/App.jsx`.
- Replace `public/cv.pdf` with your current CV PDF.
- Keep all assets inside the project; do not rely on private file paths or hotlinked image URLs.

## Notes

The visual system uses React, CSS, SVG, and Canvas for atmospheric interactions rather than requiring WebGL. This is intentional: the requested style is flat-but-alive, tactile, and surreal, and the site needs to remain practical on Android phones and static GitHub Pages hosting. See `SOURCE_AUDIT.md` for the source choices and trade-offs.

## Living video layers
13 silent looping clips live in `public/assets/video/` (mp4 + jpg poster). `src/video.jsx` (`LoopVideo`) lazy-loads each one, plays only while visible, and honours the Motion/Stillness toggle, reduced-motion and Data Saver. Stills stay underneath as fallback. To swap a clip, replace the mp4/jpg with the same name.

## Cosmic bodies, portal and symbols
- `src/cosmic.jsx` uses three + @react-three/fiber (lazy-loaded) for the star-point bodies and the portal galaxy.
- `src/bodyPoints.js` holds the point clouds for the three body figures.
- `src/symbols.jsx`, `src/presences.jsx`, `src/portal.jsx`, `src/doors.js` add the Symbols section, Celestial Presences, the Portal page and the ten-door list.
- Portraits were prepared with the rembg background-removal library, then lit procedurally.


## Cosmic sound effects

The header includes an optional **Sound off / Sound on** control. When enabled, the site layers a very quiet evolving drone and filtered cosmic-noise bed beneath the interface, with occasional breath-like spectral whispers (abstract sound design, not intelligible speech). A low sub-bass swell and rising shimmer mark entry into a world. The Solar Coast uses warm rising harmonics, the Moon Ocean uses submerged low tones and soft water-like noise, and the Angel Veil uses airy high harmonics and a faint breath texture. Buttons and navigation retain their small chime cues. All audio is synthesized locally with the Web Audio API; no external audio files or network requests are needed. Audio is off by default, starts only after the visitor explicitly enables it, and can be switched off at any time. Browser audio support and the first user gesture are required.
