import { createRoot } from 'react-dom/client';
import Scene from './Scene';

/**
 * Entry point for the blackhole scene, imported dynamically by the
 * capability gate in `src/pages/index.astro`.
 *
 * ponytail: mounts React by hand instead of using an Astro `client:*`
 * island. An island always ships the react-dom client runtime (~180 kB)
 * before the component can decide anything, so the gate could never keep
 * it off phones. Mounting from a dynamic import puts React and three.js
 * in the same lazily fetched chunk, behind the gate.
 */
const container = document.getElementById('scene-root');
if (container) createRoot(container).render(<Scene />);
