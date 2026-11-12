const fallbackSiteUrl = process.env.NODE_ENV === 'production'
  ? 'https://www.your-domain.ma'
  : 'http://localhost:3000';

export const company = {
  // Working project name; confirm the public brand before launch.
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || '79 Events',
  description: 'Organisation, production et coordination d’événements d’entreprise et de tourisme d’affaires au Maroc.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '',
  socialLinks: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  },
  languages: ['fr'] as const,
  locations: ['Marrakech', 'Casablanca', 'Rabat', 'Tanger', 'Agadir', 'Fès'],
  verifiedStatistics: [] as {label: string; value: string}[],
  approvedTestimonials: [] as {quote: string; author: string; organization: string}[],
  approvedClientLogos: [] as {name: string; src: string}[],
};

export function getSiteUrl() {
  return company.siteUrl.replace(/\/$/, '');
}

export const isPublicSiteConfigured = Boolean(
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('your-domain'),
);
