import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(projectRoot, 'public', 'images', 'pexels');
const metadataPath = path.join(outputDir, 'SOURCES.md');

function loadLocalEnv() {
  const envPath = path.join(projectRoot, '.env.local');
  return readFile(envPath, 'utf8')
    .then((contents) => {
      for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
      }
    })
    .catch(() => undefined);
}

const assets = [
  {name: 'hero-event', query: 'luxury outdoor event evening Morocco desert', alt: 'Luxury outdoor event at sunset'},
  {name: 'wedding-beach', query: 'luxury beach wedding ceremony', alt: 'Luxury beach wedding ceremony'},
  {name: 'wedding-ceremony', query: 'elegant wedding ceremony floral decor', alt: 'Elegant wedding ceremony decor'},
  {name: 'gala-event', query: 'luxury gala dinner event ballroom', alt: 'Luxury gala dinner event'},
  {name: 'desert-dinner', query: 'luxury dinner in desert at night', alt: 'Luxury dinner in the desert'},
  {name: 'private-dinner', query: 'private fine dining table event', alt: 'Private fine dining table'},
  {name: 'corporate-event', query: 'corporate event conference stage audience', alt: 'Corporate event on a conference stage'},
  {name: 'technical-setup', query: 'professional live event stage lighting production', alt: 'Professional live event production setup'},
  {name: 'sports-event', query: 'sports event crowd stadium celebration', alt: 'Sports event crowd and celebration'},
  {name: 'conference-audience', query: 'business conference audience auditorium', alt: 'Audience at a business conference'},
  {name: 'conference-presentation', query: 'business keynote presentation stage', alt: 'Business keynote presentation on stage'},
  {name: 'stage-microphone', query: 'microphone on stage event lighting', alt: 'Microphone on an event stage'},
  {name: 'museum-hall', query: 'modern museum interior exhibition hall', alt: 'Modern museum exhibition hall'},
  {name: 'gallery-space', query: 'contemporary art gallery exhibition interior', alt: 'Contemporary art gallery interior'},
  {name: 'hotel-facade', query: 'luxury hotel exterior architecture Morocco', alt: 'Luxury hotel exterior'},
];

async function fetchJson(url, apiKey) {
  const response = await fetch(url, {headers: {Authorization: apiKey}});
  if (!response.ok) throw new Error(`Pexels request failed (${response.status} ${response.statusText})`);
  return response.json();
}

async function downloadAsset(photo, asset) {
  const imageUrl = photo.src.large2x || photo.src.large || photo.src.original;
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Image download failed for ${asset.name} (${response.status})`);
  const destination = path.join(outputDir, `${asset.name}.jpg`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return {
    ...asset,
    id: photo.id,
    pexelsUrl: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    sourceUrl: imageUrl,
  };
}

await loadLocalEnv();
const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) throw new Error('PEXELS_API_KEY is missing. Add it to .env.local or the environment.');

await mkdir(outputDir, {recursive: true});
const usedPhotoIds = new Set();
const downloaded = [];

for (const asset of assets) {
  const params = new URLSearchParams({query: asset.query, orientation: 'landscape', size: 'large', per_page: '20'});
  const data = await fetchJson(`https://api.pexels.com/v1/search?${params}`, apiKey);
  const photo = data.photos?.find((candidate) => !usedPhotoIds.has(candidate.id));
  if (!photo) throw new Error(`No unique Pexels result found for ${asset.name}.`);
  usedPhotoIds.add(photo.id);
  downloaded.push(await downloadAsset(photo, asset));
  console.log(`Downloaded ${asset.name}.jpg`);
}

const sourceLines = [
  '# Pexels image sources',
  '',
  'These local images are used as stock imagery for the 79 EVENTS website. They do not represent confirmed 79 EVENTS projects.',
  '',
  '| Local file | Search brief | Photographer | Pexels photo |',
  '| --- | --- | --- | --- |',
  ...downloaded.map((photo) => `| \`${photo.name}.jpg\` | ${photo.query} | [${photo.photographer}](${photo.photographerUrl}) | [View on Pexels](${photo.pexelsUrl}) |`),
  '',
];
await writeFile(metadataPath, sourceLines.join('\n'), 'utf8');
console.log(`Wrote ${downloaded.length} image credits to public/images/pexels/SOURCES.md`);
