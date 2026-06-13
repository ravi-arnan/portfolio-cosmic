export interface SkillCategory {
  title: string;
  accent: 'ion' | 'ember' | 'rose';
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    accent: 'ion',
    skills: ['React', 'TypeScript', 'Astro', 'Tailwind CSS', 'Three.js', 'Next.js'],
  },
  {
    title: 'Backend',
    accent: 'ember',
    skills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'REST APIs', 'GraphQL'],
  },
  {
    title: 'Security',
    accent: 'rose',
    skills: [
      'Penetration Testing',
      'SOAR Automation',
      'OWASP Top 10',
      'Network Security',
      'Cryptography',
      'Auth/IAM',
    ],
  },
];
