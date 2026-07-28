# Cosmic Portfolio, Ravi Arnan Irianto

A single-page personal portfolio built around a black hole. The whole site is one
full-page scroll experience: a WebGL black hole anchors the hero, and the camera,
accretion disk, and starfield react to scroll progress as each section passes by.

**Live:** https://raviarnan.dev

## Tech Stack

- **[Astro](https://astro.build)**, static site framework, islands architecture
- **[React](https://react.dev)** (19), only for the 3D scene
- **[Three.js](https://threejs.org)** via **[@react-three/fiber](https://r3f.docs.pmnd.rs)** + **drei** + **postprocessing**, the black hole, accretion disk, photon ring, asteroid field
- **[GSAP](https://gsap.com)** + **[Lenis](https://lenis.darkroom.engineering)**, scroll choreography and smooth scrolling
- **[Tailwind CSS](https://tailwindcss.com)** (v4), styling via design tokens
- **TypeScript**, typed data layer and scroll logic

## Project Structure

```text
src/
├── components/
│   ├── sections/        # Hero, About, Work, Contributions, Skills,
│   │                    #   Education, Certifications, Contact, Footer
│   ├── three/           # WebGL scene: Scene, AccretionDisk, PhotonRing,
│   │   ├── shaders/     #   EventHorizon, AsteroidField, Debris, Planet
│   │   ├── mount.tsx    #   React entry point, dynamically imported
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

Content lives in `src/data/`. Update those files to change what the site shows,
no component edits required.

## Commands

All commands are run from the project root:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `npm install`         | Install dependencies                             |
| `npm run dev`         | Start the dev server at `localhost:4321`         |
| `npm run build`       | Build the production site to `./dist/`           |
| `npm run preview`     | Preview the production build locally             |
| `npx astro check`     | Typecheck `.astro` files and the data layer      |
| `node scripts/og.mjs` | Regenerate the social share card `public/og.png` |

> Requires Node `>=22.12.0`.

## Deployment

Deployed on **Netlify** (`netlify.toml`): build command `npm run build`, publish
directory `dist`. Security headers (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) are set at
the edge, and `/_astro/*` is served immutable since Astro fingerprints it.

The contact form posts to [Web3Forms](https://web3forms.com) with a honeypot
field. The access key is public by design and lives in `Contact.astro`.

## Accessibility and Performance Notes

- The 3D scene sits behind a capability gate that runs in plain JS before any of
  the 3D stack is fetched. Reduced-motion, small-screen (under 768px), low-memory
  and no-WebGL2 visitors download neither React nor Three.js and see the static
  poster (`public/poster-blackhole.webp`) instead.
- Pinned scroll stages hide content without removing it from the tab order, so
  `src/scripts/scroll.ts` moves the page to wherever a newly focused element is
  actually visible. A skip link bypasses the nav.
- A sitemap is generated automatically via `@astrojs/sitemap`.
