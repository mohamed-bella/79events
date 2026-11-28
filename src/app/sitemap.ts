import type {MetadataRoute} from 'next';
import {getSiteUrl, isPublicSiteConfigured} from '@/lib/company';
import {getPublishedPages, publicPathFor, type Locale} from '@/content/registry';
import {routing} from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  if (!isPublicSiteConfigured) return [];
  const localizedPath = (path: string, locale: Locale) => locale === routing.defaultLocale ? path : `/${locale}${path === '/' ? '' : path}`;
  const homePaths = Object.fromEntries(routing.locales.map((locale) => [locale, `${base}${localizedPath('/', locale)}`]));
  const home = routing.locales.map((locale) => ({
    url:homePaths[locale], lastModified:new Date('2026-11-11'), changeFrequency:'monthly' as const, priority:1,
    alternates:{languages:{...homePaths, 'x-default':homePaths[routing.defaultLocale]}},
  }));
  const pages = getPublishedPages('fr').filter((page) => page.indexable);
  const localized = pages.flatMap((page) => routing.locales.map((locale) => {
    const paths = Object.fromEntries(routing.locales.map((supportedLocale) => [supportedLocale, `${base}${localizedPath(publicPathFor(page, supportedLocale), supportedLocale)}`]));
    return {
      url:`${base}${localizedPath(publicPathFor(page, locale), locale)}`,
      lastModified:new Date(page.updatedAt),
      changeFrequency:'monthly' as const,
      priority:page.kind === 'hub' ? 0.8 : 0.65,
      alternates:{languages:{...paths, 'x-default':paths[routing.defaultLocale]}},
    };
  }));
  return [...home, ...localized];
}
