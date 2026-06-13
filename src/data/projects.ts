import type { ImageMetadata } from 'astro';
import soar from '../assets/soar.png';
import asahlagi from '../assets/asahlagi.png';
import wastra from '../assets/wastra.png';
import myheic from '../assets/myheic.png';
import mykalender from '../assets/mykalender.png';
import telkomDashboard from '../assets/telkom-dashboard.png';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  image: ImageMetadata;
  github: string | null;
  live: string | null;
  confidential?: boolean;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'SOAR Open-Source',
    description:
      'Security orchestration, automation, and response platform built on n8n, Wazuh, and a local Ollama LLM. Detects malware and phishing, enriches alerts with VirusTotal, and triggers active response with human-in-the-loop confirmation over Telegram. Thesis project.',
    tags: ['n8n', 'Wazuh', 'Ollama', 'Security Automation', 'Docker'],
    image: soar,
    github: 'https://github.com/ravi-arnan/soar-project',
    live: null,
    featured: true,
  },
  {
    title: 'Asahlagi',
    description:
      'Learning platform that turns any study material into automatic quizzes with daily challenges, XP, and streaks. Capstone project with a React and TypeScript frontend, FastAPI backend, and a 52-test suite.',
    tags: ['React', 'TypeScript', 'FastAPI', 'Python'],
    image: asahlagi,
    github: 'https://github.com/ravi-arnan/TempaCapstoneProject',
    live: null,
  },
  {
    title: 'Wastra',
    description:
      'Smart tourism platform that monitors crowd levels at Indonesian destinations in real time, helping travelers find the quietest moments at iconic spots. Built with React 19, TypeScript, and a CI pipeline.',
    tags: ['React 19', 'TypeScript', 'Real-time', 'CI/CD'],
    image: wastra,
    github: 'https://github.com/ravi-arnan/ProjectWastra',
    live: null,
  },
  {
    title: 'MyHeic',
    description:
      'Free offline HEIC to JPG converter for Windows with drag and drop, batch conversion, and a quality slider. Photos never leave your computer. Ships as a desktop app with a companion web converter.',
    tags: ['Desktop App', 'TypeScript', 'Image Processing'],
    image: myheic,
    github: 'https://github.com/ravi-arnan/myheic',
    live: null,
  },
  {
    title: 'myKalender',
    description:
      'Personal calendar whose reminders ring like real alarms. Web client built with Vite, React, and Firebase, plus a native Android app using Kotlin, Compose, and AlarmManager with Google Calendar sync.',
    tags: ['React', 'Firebase', 'Kotlin', 'Android'],
    image: mykalender,
    github: 'https://github.com/ravi-arnan/myKalender',
    live: null,
  },
  {
    title: 'Internal Telkom Dashboard',
    description:
      'Central dashboard hub and analytics center for internal Telkom operations. Conducted comprehensive security testing and vulnerability analysis, then implemented secure coding practices to protect against identified threats.',
    tags: ['Security Testing', 'Vulnerability Analysis', 'Dashboard'],
    image: telkomDashboard,
    github: null,
    live: null,
    confidential: true,
  },
];
