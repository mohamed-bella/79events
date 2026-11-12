import type {MetadataRoute} from 'next';
import {getSiteUrl, isPublicSiteConfigured} from '@/lib/company';
import {getPublishedPages, publicPathFor} from '@/content/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  if (!isPublicSiteConfigured) return [];
  const home: MetadataRoute.Sitemap[number] = {
    url:`${base}/`, lastModified:new Date('2026-11-11'), changeFrequency:'monthly', priority:1,
    alternates:{languages:{fr:`${base}/`,'x-default':`${base}/`}},
  };
  const pages = getPublishedPages('fr').filter((page) => page.indexable);
  const localized = pages.map((page) => ({
    url:`${base}${publicPathFor(page,'fr')}`,
    lastModified:new Date(page.updatedAt),
    changeFrequency:'monthly' as const,
    priority:page.kind === 'hub' ? 0.8 : 0.65,
    alternates:{languages:{fr:`${base}${publicPathFor(page,'fr')}`,'x-default':`${base}${publicPathFor(page,'fr')}`}},
  }));
  return [home, ...localized];
}
