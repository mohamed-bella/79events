import {readFile} from 'node:fs/promises';

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) throw new Error('Set UNSPLASH_ACCESS_KEY before running this script.');

const photos = JSON.parse(await readFile('src/content/unsplash-photos.json', 'utf8'));
const start = Number(process.argv[2] ?? 0);
if (!Number.isInteger(start) || start < 0 || start > photos.length) throw new Error('Pass a valid starting photo index.');
let tracked = start;
for (const photo of photos.slice(start)) {
  const url = new URL(photo.downloadLocation);
  if (url.origin !== 'https://api.unsplash.com') throw new Error('Invalid Unsplash tracking URL.');
  const response = await fetch(url, {headers: {Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1'}});
  if (!response.ok) throw new Error(`Tracked ${tracked}/${photos.length} photos; Unsplash returned ${response.status}.`);
  tracked++;
}
console.log(`Tracked ${tracked}/${photos.length} selected Unsplash photos.`);
