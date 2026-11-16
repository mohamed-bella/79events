import {mkdir, writeFile} from 'node:fs/promises';

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) throw new Error('Set UNSPLASH_ACCESS_KEY before running this script.');

const searches = [
  ['corporate', 'corporate event conference'],
  ['conference', 'conference audience stage'],
  ['launch', 'product launch event'],
  ['team', 'team building group outdoor'],
  ['gala', 'gala dinner event decor'],
  ['planning', 'event planning team meeting'],
  ['production', 'event production lighting'],
  ['marrakech', 'Marrakech Morocco'],
  ['city', 'Morocco city architecture'],
  ['landscape', 'Morocco landscape desert'],
];

const seen = new Set();
const photos = [];
const headers = {Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1'};

function catalogEntry(photo, category) {
  const photographerUrl = new URL(photo.user.links.html);
  photographerUrl.searchParams.set('utm_source', '79events');
  photographerUrl.searchParams.set('utm_medium', 'referral');
  return {
    id: photo.id,
    category,
    alt: photo.alt_description || photo.description || category,
    src: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photographerUrl.toString(),
    downloadLocation: photo.links.download_location,
  };
}

for (const [category, query] of searches) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '12');
  url.searchParams.set('orientation', 'landscape');
  const response = await fetch(url, {headers});
  if (!response.ok) throw new Error(`Unsplash search for ${category} failed: ${response.status}`);
  const data = await response.json();
  const picks = data.results.filter((photo) => !seen.has(photo.id)).slice(0, 5);
  if (picks.length < 5) throw new Error(`Only ${picks.length} unique photos found for ${category}`);
  for (const photo of picks) {
    seen.add(photo.id);
    photos.push(catalogEntry(photo, category));
  }
  console.log(`${category}: ${picks.length} photos`);
}

for (const [index, city] of ['Casablanca', 'Rabat', 'Tangier', 'Agadir', 'Fes'].entries()) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', `${city} Morocco`);
  url.searchParams.set('per_page', '10');
  url.searchParams.set('orientation', 'landscape');
  const response = await fetch(url, {headers});
  if (!response.ok) throw new Error(`Unsplash search for ${city} failed: ${response.status}`);
  const data = await response.json();
  const pick = data.results.find((photo) => !seen.has(photo.id));
  if (!pick) throw new Error(`No unique photo found for ${city}`);
  seen.delete(photos[40 + index].id);
  seen.add(pick.id);
  photos[40 + index] = catalogEntry(pick, city.toLowerCase());
  console.log(`${city}: 1 photo`);
}

await mkdir('src/content', {recursive: true});
await writeFile('src/content/unsplash-photos.json', `${JSON.stringify(photos, null, 2)}\n`);
console.log(`Saved ${photos.length} unique Unsplash photos.`);
