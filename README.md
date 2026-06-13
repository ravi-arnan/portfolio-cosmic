# Cosmic Portfolio — Ravi Arnan Irianto

A single-page personal portfolio built around a black hole. The whole site is one
full-page scroll experience: a WebGL black hole anchors the hero, and the camera,
accretion disk, and starfield react to scroll progress as each section passes by.

🌐 **Live:** https://raviarnan.netlify.app

## Tech Stack

- **[Astro](https://astro.build)** — static site framework, islands architecture
- **[React](https://react.dev)** (19) — only for the interactive 3D islands
- **[Three.js](https://threejs.org)** via **[@react-three/fiber](https://r3f.docs.pmnd.rs)** + **drei** + **postprocessing** — the black hole, accretion disk, photon ring, asteroid field
- **[GSAP](https://gsap.com)** + **[Lenis](https://lenis.darkroom.engineering)** — scroll choreography and smooth scrolling
- **[Tailwind CSS](https://tailwindcss.com)** (v4) — styling via design tokens
- **TypeScript** — typed data layer and scroll logic

## Project Structure

```text
src/
├── components/
│   ├── sections/        # Hero, About, Work, Contributions, Skills,
│   │                    #   Education, Certifications, Contact, Footer
│   ├── three/           # WebGL scene: BlackholeHero, AccretionDisk,
│   │   ├── shaders/      #   PhotonRing, EventHorizon, AsteroidField...
│   │   └── choreography.ts  # shared scroll-driven state for the 3D scene
│   ├── Nav, Loader, Starfield, SectionHeading, SocialIcon
├── data/                # Content source of truth (edit these to update the site)
│   ├── site.ts          #   name, bio, socials, experience, CV link
│   ├── projects.ts      #   work / projects
│   ├── skills.ts        #   skill categories
│   ├── certifications.ts
│   ├── education.ts
│   └── achievements.ts
├── layouts/Base.astro
├── pages/               # index.astro, 404.astro
├── scripts/scroll.ts    # Lenis + GSAP scroll orchestration
├── lib/scrollState.ts
└── styles/              # tokens.css, global.css
```

Content lives in `src/data/` — update those files to change what the site shows,
no component edits required.

## Commands

All commands are run from the project root:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the dev server at `localhost:4321`     |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the production build locally         |
| `npm run astro`   | Run Astro CLI commands (`astro check`, etc.) |

> Requires Node `>=22.12.0`.

## Deployment

Deployed on **Netlify** (`netlify.toml`): build command `npm run build`, publish
directory `dist`. Security headers (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`) are set at the edge.

The contact form posts to [Web3Forms](https://web3forms.com) with an hCaptcha
challenge — both keys are public by design and live in `Contact.astro`.

## Accessibility & Performance Notes

- The hero respects `prefers-reduced-motion` and small screens, swapping the live
  WebGL scene for a static poster (`public/poster-blackhole.webp`).
- React is loaded only for the 3D islands; the rest of the page is static HTML.
- A sitemap is generated automatically via `@astrojs/sitemap`.
