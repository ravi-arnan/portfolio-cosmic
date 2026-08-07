export interface SkillCategory {
  title: string;
  /* Icon lives here, not keyed off the title in the component: renaming a
     category should not silently drop its icon. */
  icon: 'frontend' | 'backend' | 'ai';
  accent: 'ion' | 'ember' | 'rose';
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: 'frontend',
    accent: 'ion',
    skills: ['React', 'TypeScript', 'Next.js', 'React Native', 'Astro', 'Tailwind CSS'],
  },
  {
    title: 'Backend & Infra',
    icon: 'backend',
    accent: 'ember',
    skills: [
      'Node.js',
      'Python',
      'PostgreSQL',
      'Redis',
      'REST APIs',
      'Docker',
      'Linux',
      'Auth/IAM',
      'OWASP Top 10',
    ],
  },
  {
    title: 'AI & LLM',
    icon: 'ai',
    accent: 'rose',
    skills: [
      'RAG Pipelines',
      'Prompt Engineering',
      'LLM Agents',
      'Embeddings',
      'NLP',
      'Machine Learning',
    ],
  },
];
