import photos from './unsplash-photos.json';

export type UnsplashPhoto = (typeof photos)[number];

// Each route has a distinct lead image. The second image gives the page a
// related scene and brings the full 50-photo collection into the site.
const pagePhotos: Record<string, [number, number]> = {
  events: [20, 24],
  'corporate-events': [0, 2],
  conferences: [5, 7],
  exhibitions: [4, 6],
  'product-launches': [10, 11],
  'team-building': [16, 19],
  mice: [1, 8],
  meetings: [25, 28],
  'incentive-events': [18, 15],
  services: [21, 23],
  'event-planning': [27, 29],
  'event-management': [26, 9],
  'event-production': [31, 30],
  'event-logistics': [34, 32],
  'venue-finding': [22, 33],
  locations: [45, 42],
  marrakech: [36, 37],
  casablanca: [40, 3],
  rabat: [41, 25],
  tangier: [42, 1],
  agadir: [43, 46],
  fes: [44, 38],
  venues: [14, 3],
  portfolio: [12, 49],
  about: [17, 39],
  contact: [13, 25],
  'request-a-proposal': [29, 28],
  'privacy-policy': [26, 28],
};

export function photoForPage(key: string, slot: 0 | 1 = 0): UnsplashPhoto {
  const index = pagePhotos[key]?.[slot] ?? 0;
  return photos[index];
}

export function photoAt(index: number): UnsplashPhoto {
  return photos[index];
}
