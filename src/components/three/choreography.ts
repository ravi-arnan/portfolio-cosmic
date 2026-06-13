import { scrollState } from '../../lib/scrollState';

/**
 * Full-page scroll choreography. Each section is a camera chapter; as the
 * visitor scrolls, the rig interpolates between the surrounding chapters,
 * so the blackhole travels around the composition for the whole journey
 * and returns face-on for the finale at the contact section.
 */
export interface ChoreoParams {
  /** camera position */
  camX: number;
  camY: number;
  camZ: number;
  fov: number;
  /** camera look target, lets chapters turn away from the blackhole */
  lookX: number;
  lookY: number;
  lookZ: number;
  /** blackhole group offset, shifts it around the screen composition */
  holeX: number;
  holeY: number;
  /** group yaw, changes the disk silhouette per chapter */
  yaw: number;
  /** accretion disk feed intensity 0..1+ */
  disk: number;
  /** photon ring boost 0..1+ */
  ring: number;
  /** debris pull toward the horizon 0..1 */
  pull: number;
  /** starfield drift */
  spin: number;
  /** finale presence 0..1, drives horizon sway, disk fade, bloom calm */
  finale: number;
  /** blackhole group scale, blows it up into a horizon for the finale */
  holeScale: number;
}

const CHAPTERS: Record<string, ChoreoParams> = {
  // Wide establishing shot, face to face
  hero: { camX: 0, camY: 1.2, camZ: 8, fov: 45, lookX: 0, lookY: 0, lookZ: 0, holeX: 0, holeY: 0, yaw: 0, disk: 0.15, ring: 0.7, pull: 0.05, spin: 0, finale: 0, holeScale: 1 },
  // Camera swings left: hole floats high above the photo column, text gets dark sky
  about: { camX: -1.6, camY: 0.5, camZ: 7.4, fov: 50, lookX: 0, lookY: 0, lookZ: 0, holeX: -2.5, holeY: 1.0, yaw: 0.5, disk: 0.55, ring: 1.0, pull: 0.2, spin: 0.18, finale: 0, holeScale: 1 },
  // High wide shot from the left while browsing projects
  work: { camX: -1.6, camY: 2.4, camZ: 9.5, fov: 55, lookX: 0, lookY: 0, lookZ: 0, holeX: -2.4, holeY: 0.5, yaw: 1.1, disk: 0.35, ring: 0.6, pull: 0.12, spin: 0.42, finale: 0, holeScale: 1 },
  // Scenery change: fly away from the hole into the crystal asteroid field
  contributions: { camX: 13, camY: 2.5, camZ: 0, fov: 55, lookX: 20, lookY: 2, lookZ: -6, holeX: 0.6, holeY: 1.6, yaw: 1.7, disk: 0.6, ring: 0.9, pull: 0.3, spin: 0.65, finale: 0, holeScale: 1 },
  // Back to the hole: low angle from beneath the disk plane
  skills: { camX: 2.0, camY: -1.1, camZ: 7, fov: 52, lookX: 0, lookY: 0, lookZ: 0, holeX: 2.1, holeY: -0.4, yaw: 2.3, disk: 0.8, ring: 1.1, pull: 0.42, spin: 0.85, finale: 0, holeScale: 1 },
  // Scenery change: turn toward the ringed planet, hole far behind
  education: { camX: -10, camY: 4, camZ: -3, fov: 50, lookX: -18, lookY: 4, lookZ: -12, holeX: -1.9, holeY: 0.3, yaw: 2.9, disk: 0.5, ring: 0.8, pull: 0.3, spin: 1.05, finale: 0, holeScale: 1 },
  // Same planet, swept lower angle with the rings cutting the frame
  certifications: { camX: -13.5, camY: 1.8, camZ: -3.5, fov: 57, lookX: -17.5, lookY: 3.8, lookZ: -12.5, holeX: 1.4, holeY: 1.0, yaw: 3.5, disk: 0.4, ring: 0.7, pull: 0.2, spin: 1.25, finale: 0, holeScale: 1 },
  // Finale: turn back to face the hole as it sinks below the page and
  // blows up into a glowing horizon, only its upper arc rising
  contact: { camX: 0, camY: 0.2, camZ: 7, fov: 50, lookX: 0, lookY: 0, lookZ: 0, holeX: 0, holeY: -5.4, yaw: 6.28, disk: 0.3, ring: 0.8, pull: 0.85, spin: 1.5, finale: 1, holeScale: 3.7 },
};

const KEYS = Object.keys(CHAPTERS[Object.keys(CHAPTERS)[0]]) as (keyof ChoreoParams)[];

function smootherstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Shared mutable output: sampled once per frame, read by every rig. */
export const choreo: ChoreoParams = { ...CHAPTERS.hero };

export function updateChoreo(progress: number): void {
  const marks = scrollState.marks.filter((mark) => CHAPTERS[mark.id]);
  if (marks.length === 0) return;

  // Find the surrounding chapter anchors
  let prev = marks[0];
  let next = marks[marks.length - 1];
  for (let i = 0; i < marks.length; i += 1) {
    if (marks[i].at <= progress) prev = marks[i];
    if (marks[i].at >= progress) {
      next = marks[i];
      break;
    }
  }

  const from = CHAPTERS[prev.id];
  const to = CHAPTERS[next.id];
  const span = next.at - prev.at;
  const t = span > 0 ? smootherstep(Math.min(1, Math.max(0, (progress - prev.at) / span))) : 1;

  for (const key of KEYS) {
    choreo[key] = from[key] + (to[key] - from[key]) * t;
  }
}
