const fallbackSiteUrl = process.env.NODE_ENV === 'production'
  ? 'https://www.your-domain.ma'
  : 'http://localhost:3000';

export const company = {
  // Public brand and contact details are mirrored from the approved source site.
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || '79events',
  legalName: '79 EVENTS',
  foundingDate: '2026-10-13',
  description: 'Agence événementielle de prestige au Maroc.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@79events.com',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'N° 1-2-3 Rue Mansour Eddahbi, Ouarzazate, Maroc',
  postalAddress: {
    streetAddress: 'N° 1-2-3 Rue Mansour Eddahbi',
    addressLocality: 'Ouarzazate',
    addressCountry: 'MA',
  },
  identifiers: [
    {propertyID: 'ICE', value: '004039266000022'},
    {propertyID: 'IF', value: '73441154'},
    {propertyID: 'RC', value: '14161'},
  ],
  socialLinks: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/79events/',
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
