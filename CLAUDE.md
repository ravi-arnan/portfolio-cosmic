# CLAUDE.md

Astro 6 + React 19 portfolio built around a WebGL black hole. See `README.md` for the full tech stack and file map. This file only captures the invariants worth not re-deriving.

## Invariants

- **Content is data, not markup.** `src/data/*.ts` (`site.ts`, `projects.ts`, `skills.ts`, `certifications.ts`, `education.ts`, `achievements.ts`) is the source of truth. To change what the site says, edit the data files, not the `.astro` section components that render them.
- **The 3D scene is not an Astro island.** `src/pages/index.astro` runs a plain-JS capability gate and only then dynamically imports `src/components/three/mount.tsx`, which calls `createRoot` itself. A `client:*` directive would ship react-dom (~180 kB) to every visitor before the gate could reject them, which defeats the point. Keep the gate ahead of the import.
- **Scroll behavior lives in two places.** The 3D scene's scroll-driven state is `src/components/three/choreography.ts`; the Lenis + GSAP orchestration is `src/scripts/scroll.ts`. Camera/disk/starfield reactions flow through there, not through the section components.
- **Pinned stages hide focusable content.** Scene stages fade to opacity 0 and the Work carousel slides cards off-screen while their links stay in the tab order. The `focusin` handler at the bottom of `src/scripts/scroll.ts` scrolls the page to wherever the focused element is visible. Any new pinned stage needs to fit that handler's two cases.
- **Headless WebGL needs swiftshader flags.** Any headless Chromium run against the scene must launch with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`, otherwise the canvas renders blank. `scripts/screenshot.mjs` (and the `/capture-scene` skill) already do this. Playwright's own browsers are not downloaded here; pass `channel: 'chrome'` to use the system Chrome.
- **Deploy is Netlify auto-deploy on push.** `netlify.toml` builds `npm run build` into `dist`. Pushing to the repo triggers the deploy; there is no separate deploy step.

## Checks

- Typecheck: `npx astro check` (covers `.astro` + the typed data layer). No ESLint/Prettier config in this repo.
- Build: `npm run build`.
