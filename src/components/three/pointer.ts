/**
 * Shared cursor position in NDC (-1..1), one window listener for every
 * rig that wants pointer interactivity. The canvas layer itself is
 * pointer-events-none, so this is the only reliable input channel.
 */
export const pointer = { x: 0, y: 0 };

let attached = false;

export function ensurePointerListener(): void {
  if (attached) return;
  attached = true;
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}
