import {pexelsImage} from './pexels';

const photos = {
  'museum-hall': {src: pexelsImage('museum-hall'), alt: 'Vue intérieure d’un musée contemporain'},
  'gallery-space': {src: pexelsImage('gallery-space'), alt: 'Espace d’exposition dans une galerie contemporaine'},
  'hotel-facade': {src: pexelsImage('hotel-facade'), alt: 'Façade d’un hôtel de prestige'},
  'conference-audience': {src: pexelsImage('conference-audience'), alt: 'Public assis lors d’une conférence'},
  'conference-presentation': {src: pexelsImage('conference-presentation'), alt: 'Présentation sur scène devant un public'},
  'stage-microphone': {src: pexelsImage('stage-microphone'), alt: 'Microphone sur scène avant une intervention'},
  'hero-event': {src: pexelsImage('desert-dinner'), alt: 'Dîner événementiel dans le désert'},
  'wedding-beach': {src: pexelsImage('wedding-beach'), alt: 'Cérémonie de mariage sur une plage'},
  'wedding-ceremony': {src: pexelsImage('wedding-ceremony'), alt: 'Décor de cérémonie de mariage'},
  'gala-event': {src: pexelsImage('gala-event'), alt: 'Soirée de gala élégante'},
  'desert-dinner': {src: pexelsImage('desert-dinner'), alt: 'Dîner événementiel dans le désert'},
  'private-dinner': {src: pexelsImage('private-dinner'), alt: 'Table dressée pour un dîner privé'},
  'corporate-event': {src: pexelsImage('corporate-event'), alt: 'Événement professionnel sur une scène'},
  'technical-setup': {src: pexelsImage('technical-setup'), alt: 'Installation technique pour un événement'},
} as const;

type PhotoKey = keyof typeof photos;
export type SitePhoto = (typeof photos)[PhotoKey];

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
