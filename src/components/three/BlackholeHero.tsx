import { lazy, Suspense, useEffect, useState } from 'react';

/**
 * Capability gate for the blackhole scene. The heavy three.js chunk lives
 * entirely inside Scene and is only fetched when this gate passes, so
 * mobile, reduced-motion, low-memory, and no-WebGL2 visitors never pay
 * for it. The static poster underneath stays visible in those cases.
 */
const Scene = lazy(() => import('./Scene'));

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

function canRunScene(): boolean {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = matchMedia('(max-width: 767px)').matches;
  const memory = (navigator as NavigatorWithMemory).deviceMemory;
  const lowMemory = memory !== undefined && memory < 4;
  const webgl2 = !!document.createElement('canvas').getContext('webgl2');
  return !reduced && !smallScreen && !lowMemory && webgl2;
}

export default function BlackholeHero() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(canRunScene());
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  );
}
