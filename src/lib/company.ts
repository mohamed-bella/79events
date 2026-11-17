const fallbackSiteUrl = process.env.NODE_ENV === 'production'
  ? 'https://www.your-domain.ma'
  : 'http://localhost:3000';

export const company = {
  // Public brand and contact details are mirrored from the approved source site.
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Dakhla Events',
  description: 'Agence événementielle de prestige à Dakhla, entre Sahara et Atlantique.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@dakhlaevents.ma',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+212 663 32 23 02',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Dakhla, Morocco',
  socialLinks: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/dakhlaevents.ma/',
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
