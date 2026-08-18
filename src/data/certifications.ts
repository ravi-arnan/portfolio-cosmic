export interface Certification {
  title: string;
  issuer: string;
  date: string;
  /* Optional. Entries without a public credential URL render as a plain card. */
  link?: string;
}

export const certifications: Certification[] = [
  {
    title: 'Artificial Intelligence Learning Path',
    issuer: 'Dicoding Indonesia',
    date: '2026',
  },
  {
    title: 'Google AI Essentials',
    issuer: 'Coursera',
    date: 'Oct 2025',
    link: 'https://coursera.org/share/06c09677c6c05314b378ac357a2399ad',
  },
  {
    title: 'Digital Talent Scholarship',
    issuer: 'Kominfo',
    date: '2025',
  },
  {
    title: 'Alibaba Cloud Certified Developer',
    issuer: 'Alibaba Cloud',
    date: 'Jul 2024',
    link: 'https://drive.google.com/file/d/12i9spnMkRXV-cB0csPjtuwQ6VQauKqWN/view',
  },
  {
    title: 'Learn the Basics of Data Science',
    issuer: 'Dicoding',
    date: 'Feb 2024',
    link: 'https://www.dicoding.com/certificates/N9ZOO0VRDZG5',
  },
  {
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Coursera',
    date: 'Dec 2025',
    link: 'https://coursera.org/share/b077575e599fadcf091657bc9b73e4e5',
  },
  {
    title: 'Cybersecurity For Everyone',
    issuer: 'University of Maryland, College Park',
    date: 'Jul 2024',
    link: 'https://coursera.org/share/d9d79d476752e22786129c9ddc55fc24',
  },
  {
    title: 'Tech Buddy, Certificate of Completion 2023 - 2024',
    issuer: 'Google Developer Student Club Universitas Udayana',
    date: '2024',
    link: 'https://drive.google.com/file/d/1aJ_OZS01SjE34Q9P8DD-OknCzp-ZrYI9/view?usp=sharing',
  },
];
