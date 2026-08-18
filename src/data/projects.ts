import type { ImageMetadata } from 'astro';
import soar from '../assets/soar.png';
import asahlagi from '../assets/asahlagi.png';
import wastra from '../assets/wastra.png';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  /* Optional. Cards without a screenshot render a typographic panel instead,
     which is the only option for confidential work and for the CLI/testnet
     projects that have nothing worth screenshotting. */
  image?: ImageMetadata;
  github: string | null;
  live: string | null;
  confidential?: boolean;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'PeopleOS',
    description:
      'Internal people and culture platform for a multi-outlet F&B group, built across a multi-repo TypeScript product: React web and PWA, a React Native Android app, a Node.js API, PostgreSQL and Redis. 77+ merged pull requests covering geofenced clock in/out, automated shift scheduling, role-based access control, and push notifications with WhatsApp fallback. I own staging and production on Docker Compose and PM2.',
    tags: ['TypeScript', 'React', 'React Native', 'Node.js', 'PostgreSQL', 'Docker'],
    github: null,
    live: null,
    confidential: true,
    featured: true,
  },
  {
    title: 'Pact',
    description:
      'On-chain commitment staking for running goals. A group stakes USDC on a distance target and payouts settle from GPS-verified sessions. Settlement needs an oracle multisig co-signature, so a spoofed run never clears on its own, and every stake is a time-locked claimable balance its owner can reclaim. Built solo for the APAC Stellar Hackathon.',
    tags: ['Next.js 16', 'TypeScript', 'Stellar SDK', 'Web3'],
    // TODO: repo is still private. Flip this to the URL the moment it goes public.
    github: null,
    live: null,
  },
  {
    title: 'RAG for Indonesian Legal & Tax Documents',
    description:
      'Retrieval-augmented generation over Indonesian tax regulation PDFs. 776 ingested chunks, IndoBERT embeddings running CPU-only, generation served through an OpenAI-compatible interface. Chunking follows the numbered article structure instead of a fixed window, and a golden-query suite catches retrieval regressions before they reach an answer.',
    tags: ['Python', 'RAG', 'IndoBERT', 'NLP'],
    github: 'https://github.com/ravi-arnan/stki-rag',
    live: null,
  },
  {
    title: 'Agentic OS',
    description:
      'Local web dashboard wrapping a headless coding agent, with four one-click automations: daily briefing, repo and inbox status sweep, session journaling, and quick capture. Tracks API cost and productivity per session, which turned out to be the part that actually changed how I work.',
    tags: ['TypeScript', 'LLM Agents', 'Developer Tools'],
    github: 'https://github.com/ravi-arnan/agentic-os',
    live: null,
  },
  {
    title: 'Asahlagi',
    description:
      'Learning platform that turns any study material into automatic quizzes with daily challenges, XP, and streaks. Backend infers student comprehension from assessment results. Awarded Best Capstone Project on the Dicoding AI learning path, with a React and TypeScript frontend, FastAPI backend, and a 52-test suite.',
    tags: ['React', 'TypeScript', 'FastAPI', 'Python'],
    image: asahlagi,
    github: 'https://github.com/ravi-arnan/TempaCapstoneProject',
    live: null,
  },
  {
    title: 'Apex Stradale',
    description:
      'A 3D car showcase in React Three Fiber, built to hold a fixed frame budget on mid-range phones rather than to look good on my machine. Geometry stays simplified and the materials do the work the mesh used to.',
    tags: ['React Three Fiber', 'WebGL', 'TypeScript'],
    github: 'https://github.com/ravi-arnan/apex-stradale',
    live: 'https://apex-stradale.vercel.app',
  },
  {
    title: 'SOAR Open-Source',
    description:
      'Security orchestration, automation, and response platform built on n8n, Wazuh, and a local Ollama LLM. Detects malware and phishing, enriches alerts with VirusTotal, and triggers active response with human-in-the-loop confirmation over Telegram. Thesis project.',
    tags: ['n8n', 'Wazuh', 'Ollama', 'Security Automation', 'Docker'],
    image: soar,
    github: 'https://github.com/ravi-arnan/soar-project',
    live: null,
  },
  {
    title: 'Wastra',
    description:
      'AI system for Indonesian batik, built for the Astra elevAIte hackathon. It did not place, and the postmortem was worth more than the project: we spent our hours on classification accuracy and almost none on who would open it twice.',
    tags: ['React 19', 'TypeScript', 'Machine Learning', 'CI/CD'],
    image: wastra,
    github: 'https://github.com/ravi-arnan/ProjectWastra',
    live: null,
  },
];
