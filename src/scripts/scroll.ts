import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '../lib/scrollState';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

if (!prefersReducedMotion) {
  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* Section anchor marks: the 3D choreography maps page progress to these */
const CHAPTER_IDS = [
  'hero',
  'about',
  'work',
  'contributions',
  'skills',
  'education',
  'certifications',
  'contact',
];

function computeMarks() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (total <= 0) return;
  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
  /* Each section emits an enter AND an exit mark with the same chapter
     params, so the camera pose HOLDS while a pinned stage is on screen
     and the flight to the next vista happens between stages. */
  scrollState.marks = CHAPTER_IDS.flatMap((id) => {
    const el = document.getElementById(id);
    if (!el) return [];
    const rect = el.getBoundingClientRect();
    if (rect.height === 0) return []; // hidden sections (e.g. contributions pre-fetch)
    const top = rect.top + window.scrollY;
    const enter = id === 'hero' ? 0 : clamp01(top / total);
    const exit = clamp01((top + rect.height - window.innerHeight) / total);
    return exit > enter + 0.001
      ? [
          { id, at: enter },
          { id, at: exit },
        ]
      : [{ id, at: enter }];
  });
}

computeMarks();
window.addEventListener('resize', computeMarks);
ScrollTrigger.addEventListener('refresh', computeMarks);

/* Whole-page progress: drives the persistent 3D scene choreography */
if (!prefersReducedMotion) {
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (st) => {
      scrollState.pageProgress = st.progress;
      scrollState.velocity = st.getVelocity() / 1000;
    },
  });
}

/* Hero stage: intro-specific progress (headline fade, initial dolly) */
const hero = document.querySelector('#hero');
if (hero && !prefersReducedMotion) {
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (st) => {
      scrollState.heroProgress = st.progress;
    },
  });

  /* Headline drifts up and fades as the camera falls toward the horizon */
  const heroCopy = hero.querySelector('[data-hero-copy]');
  if (heroCopy) {
    gsap.to(heroCopy, {
      opacity: 0,
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '40% top',
        scrub: true,
      },
    });
  }
}

/* Smooth-scroll nav anchors through Lenis so they respect easing.
   [data-skip-smooth] opts out: the skip link needs the native jump, which
   is what moves keyboard focus into the target. */
document
  .querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not([data-skip-smooth])')
  .forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = anchor.getAttribute('href');
      if (!target || target === '#') return;
      if (lenis && document.querySelector(target)) {
        event.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
      }
    });
  });

/* Section animations. Two motion modes:
   - desktop: sections are pinned scenes (content materializes centered,
     holds, dissolves) and Work is a horizontal carousel
   - mobile: sections flow normally with rise-in reveals
   Reduced-motion matches neither query, so everything stays static. */
gsap.matchMedia().add(
  {
    desktopMotion: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    mobileMotion: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  },
  (context) => {
    const scenesActive = Boolean(context.conditions?.desktopMotion);
    const insideStage = (el: Element) => el.closest('[data-stage]') !== null;

    /* Rise-in reveals, only for elements not owned by a pinned stage */
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      if (scenesActive && insideStage(el)) return;
      gsap.from(el, {
        opacity: 0,
        y: 48,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      if (scenesActive && insideStage(group)) return;
      gsap.from(Array.from(group.children), {
        opacity: 0,
        y: 56,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 82%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((rule) => {
      if (scenesActive && insideStage(rule)) return;
      gsap.from(rule, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: rule, start: 'top 88%', once: true },
      });
    });

    /* Starfield layers: scrubbed parallax across the whole page */
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((layer) => {
      const speed = Number(layer.dataset.parallax ?? 8);
      gsap.to(layer, {
        yPercent: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    });

    if (!scenesActive) return;

    /* Scene stages: content materializes centered, holds, dissolves */
    gsap.utils.toArray<HTMLElement>('[data-stage="scene"]').forEach((stage) => {
      const content = stage.querySelector('[data-scene-content]');
      if (!content) return;
      gsap
        .timeline({
          scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        .fromTo(
          content,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.24, ease: 'power1.out' }
        )
        .to(content, { opacity: 1, duration: 0.52 })
        .to(content, { opacity: 0, scale: 1.04, duration: 0.24, ease: 'power1.in' });
    });

    /* Work carousel: vertical scroll slides the track right to left */
    const carouselStage = document.querySelector<HTMLElement>('[data-stage="carousel"]');
    const carouselTrack = carouselStage?.querySelector<HTMLElement>('[data-carousel-track]');
    if (carouselStage && carouselTrack) {
      gsap.to(carouselTrack, {
        x: () => -(carouselTrack.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: carouselStage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    /* ---- Keyboard reachability inside pinned stages ---- */
    /* A pinned stage hides content without removing it from the tab order:
       scene content fades to opacity 0, carousel cards slide off-screen.
       Tab does not scroll a pinned element into view (it never left the
       viewport box), so a keyboard visitor would focus things they cannot
       see. Move the page to the scroll position where the focused content
       is actually on screen. */
    function jumpTo(top: number) {
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo({ top, behavior: 'auto' });
    }

    function stageScrollTop(stage: HTMLElement, progress: number) {
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      return stageTop + (stage.offsetHeight - window.innerHeight) * progress;
    }

    const onFocusIn = (event: FocusEvent) => {
      const el = event.target as HTMLElement | null;
      const stage = el?.closest<HTMLElement>('[data-stage]');
      if (!el || !stage) return;

      if (stage.dataset.stage === 'scene') {
        const content = stage.querySelector<HTMLElement>('[data-scene-content]');
        // Halfway through the stage is the hold beat, where opacity is 1
        if (content && Number(getComputedStyle(content).opacity) < 0.9) {
          jumpTo(stageScrollTop(stage, 0.5));
        }
        return;
      }

      if (stage !== carouselStage || !carouselTrack) return;
      const rect = el.getBoundingClientRect();
      if (rect.right > 0 && rect.left < window.innerWidth) return; // already visible
      const travel = carouselTrack.scrollWidth - window.innerWidth;
      if (travel <= 0) return;
      // Solve for the track offset that parks this card near the left edge
      const shift = window.innerWidth * 0.08 - rect.left;
      const currentX = Number(gsap.getProperty(carouselTrack, 'x'));
      const progress = Math.min(1, Math.max(0, -(currentX + shift) / travel));
      jumpTo(stageScrollTop(stage, progress));
    };

    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }
);
