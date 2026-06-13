export interface Education {
  degree: string;
  school: string;
  location: string;
  period: string;
  detail: string;
}

export const education: Education[] = [
  {
    degree: 'Bachelor of Information Technology',
    school: 'Udayana University',
    location: 'Jimbaran, Indonesia',
    period: '2023 - Present',
    detail: 'Current GPA: 3.65/4.00',
  },
  {
    degree: 'Mathematics and Natural Sciences',
    school: 'SMA Negeri 2 Purwokerto',
    location: 'Purwokerto, Indonesia',
    period: '2020 - 2023',
    detail: 'Science track with a focus on mathematics and computing.',
  },
];
