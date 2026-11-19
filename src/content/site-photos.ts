import {dakhlaImage} from './dakhla';

const photos = {
  // CC0 photographs from the Twenty Twenty-Four collection (Rawpixel).
  'museum-hall': {src: '/images/stock/museum.webp', alt: 'Vue intérieure d’un musée'},
  'gallery-space': {src: '/images/stock/art-gallery.webp', alt: 'Espace d’exposition dans une galerie'},
  'hotel-facade': {src: '/images/stock/hotel-facade.webp', alt: 'Façade d’un hôtel'},
  'conference-audience': {src: '/images/stock/audience.webp', alt: 'Public assis lors d’une conférence'},
  'conference-presentation': {src: '/images/stock/presentation.webp', alt: 'Présentation sur scène devant un public'},
  'stage-microphone': {src: '/images/stock/microphone.webp', alt: 'Microphone sur scène avant une intervention'},
  'hero-event': {src: dakhlaImage('hero-event'), alt: 'Réception événementielle en plein air'},
  'wedding-beach': {src: dakhlaImage('wedding-beach'), alt: 'Cérémonie de mariage sur une plage'},
  'wedding-ceremony': {src: dakhlaImage('wedding-ceremony'), alt: 'Décor de cérémonie de mariage'},
  'gala-event': {src: dakhlaImage('gala-event'), alt: 'Soirée de gala'},
  'desert-dinner': {src: dakhlaImage('desert-dinner'), alt: 'Dîner événementiel dans le désert'},
  'private-dinner': {src: dakhlaImage('private-dinner'), alt: 'Table dressée pour un dîner privé'},
  'corporate-event': {src: dakhlaImage('corporate-event'), alt: 'Événement professionnel'},
  'technical-setup': {src: dakhlaImage('technical-setup'), alt: 'Installation technique pour un événement'},
} as const;

type PhotoKey = keyof typeof photos;
export type SitePhoto = (typeof photos)[PhotoKey];

// Reuse neutral event scenes for location pages rather than depicting another city.
const pagePhotos: Record<string, readonly [PhotoKey, PhotoKey]> = {
  events: ['conference-audience', 'gala-event'],
  'corporate-events': ['conference-audience', 'private-dinner'],
  conferences: ['conference-presentation', 'conference-audience'],
  exhibitions: ['gallery-space', 'technical-setup'],
  'product-launches': ['gala-event', 'technical-setup'],
  'team-building': ['desert-dinner', 'hero-event'],
  mice: ['conference-audience', 'conference-presentation'],
  meetings: ['conference-presentation', 'private-dinner'],
  'incentive-events': ['desert-dinner', 'wedding-beach'],
  services: ['technical-setup', 'hero-event'],
  'event-planning': ['hero-event', 'gala-event'],
  'event-management': ['corporate-event', 'technical-setup'],
  'event-production': ['stage-microphone', 'technical-setup'],
  'event-logistics': ['technical-setup', 'corporate-event'],
  'venue-finding': ['hotel-facade', 'museum-hall'],
  locations: ['hero-event', 'wedding-beach'],
  marrakech: ['hero-event', 'private-dinner'],
  casablanca: ['corporate-event', 'gala-event'],
  rabat: ['technical-setup', 'private-dinner'],
  tangier: ['hero-event', 'gala-event'],
  agadir: ['wedding-beach', 'desert-dinner'],
  fes: ['private-dinner', 'hero-event'],
  venues: ['private-dinner', 'gallery-space'],
  portfolio: ['gala-event', 'wedding-ceremony'],
  about: ['hero-event', 'wedding-beach'],
  contact: ['hero-event', 'private-dinner'],
  'request-a-proposal': ['conference-audience', 'technical-setup'],
  'privacy-policy': ['hero-event', 'private-dinner'],
};

export function photoForPage(key: string, slot: 0 | 1 = 0): SitePhoto {
  const pair = pagePhotos[key] ?? ['hero-event', 'corporate-event'];
  return photos[pair[slot]];
}
