export interface ChapterMark {
  /** section element id */
  id: string;
  /** page progress (0..1) where this section anchors */
  at: number;
}

export interface ScrollState {
  /** 0..1 progress through the hero scroll stage */
  heroProgress: number;
  /** 0..1 progress through the entire document */
  pageProgress: number;
  /** smoothed scroll velocity, roughly -1..1 */
  velocity: number;
  /** section anchor points, written by scroll.ts, read by the 3D choreography */
  marks: ChapterMark[];
}

/**
 * globalThis-guarded singleton so the page script (writer) and the React
 * island (reader) always share one object, even across separate Vite chunks.
 */
export const scrollState: ScrollState = ((
  globalThis as typeof globalThis & { __scrollState?: ScrollState }
).__scrollState ??= { heroProgress: 0, pageProgress: 0, velocity: 0, marks: [] });
