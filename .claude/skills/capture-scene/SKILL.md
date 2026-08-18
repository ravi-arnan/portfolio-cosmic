---
name: capture-scene
description: Screenshot the black hole hero at a given scroll position using the repo's headless-WebGL Playwright script. Invoke as /capture-scene <scrollY> [outfile].
disable-model-invocation: true
---

# capture-scene

Wraps `scripts/screenshot.mjs` to capture the WebGL scene at a scroll checkpoint. The script launches Chromium with swiftshader so the black hole actually renders headless, waits for the lazy Scene chunk to load and Lenis to settle, then screenshots and reports canvas size + any page/console errors.

## Prerequisite

The dev server must be running at `http://localhost:4321/`:

```bash
npm run dev
```

## Usage

`/capture-scene <scrollY> [outfile]`

- `scrollY`: pixels to scroll before capturing (default `0` = hero top). Try values like `1200`, `2400` to reach later sections.
- `outfile`: output PNG path (default `/tmp/hero.png`).

Run:

```bash
node scripts/screenshot.mjs <scrollY> <outfile>
```

Set `HIDE_UI=1` to strip the headline and nav and capture the bare scene (poster shot):

```bash
HIDE_UI=1 node scripts/screenshot.mjs <scrollY> <outfile>
```

## After capture

Read the output PNG to inspect the render, and check the script's JSON stdout. `hasCanvas` should be a `WxH` string (blank/`null` means WebGL failed to init) and `errors` should be empty.
