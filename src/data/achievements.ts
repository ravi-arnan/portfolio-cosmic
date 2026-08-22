export interface Achievement {
  title: string;
  year: string;
  icon: 'trophy' | 'star' | 'award' | 'briefcase';
  description: string;
}

export const achievements: Achievement[] = [
  {
    title: 'Fullstack Developer Intern at Unicorn Food and Services',
    year: 'Mar 2026 - Aug 2026',
    icon: 'briefcase',
    description:
      '78 merged pull requests on PeopleOS, their internal people and culture platform, plus ownership of staging and production deployment.',
  },
  {
    title: 'Best Capstone Project, Tempa led by Dicoding (Artificial Intelligence)',
    year: '2026',
    icon: 'trophy',
    description:
      'Awarded for a backend service that infers student comprehension from quiz assessment results.',
  },
  {
    title: '1st Place, SPORTI Chess Competition',
    year: '2024 & 2025',
    icon: 'trophy',
    description:
      'First place in the Information Technology Sportivity chess competition two years in a row.',
  },
  {
    title: 'IT Student of the Year Finalist (Pilmapres TI)',
    year: '2024',
    icon: 'star',
    description:
      'Finalist for the Information Technology Outstanding Student Award, representing the faculty at university level.',
  },
  {
    title: 'BSI Inspiration Scholarship',
    year: '2024',
    icon: 'award',
    description:
      'Awarded for outstanding academic performance and active organizational contribution.',
  },
];
