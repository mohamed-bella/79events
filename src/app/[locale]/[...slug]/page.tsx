import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {ContentPage} from '@/components/pages/content-page';
import {getPageByPath, getPublishedPages, type Locale} from '@/content/registry';
import {routing} from '@/i18n/routing';
import {JsonLd, localizedPageMetadata, jsonLd} from '@/lib/seo/metadata';

export const dynamicParams = true;

export function generateStaticParams({params}: {params:{locale:string; slug?:string[]}}) {
  if (!hasLocale(routing.locales, params.locale)) return [];
  const locale = params.locale as Locale;
  return getPublishedPages(locale).map((page) => ({slug:(locale === 'fr' ? page.frPath : page.path).split('/')}));
}

export async function generateMetadata({params}: {params:Promise<{locale:string; slug:string[]}>}): Promise<Metadata> {
  const {locale:rawLocale, slug} = await params;
  if (!hasLocale(routing.locales, rawLocale)) return {};
  const page = getPageByPath(slug.join('/'), rawLocale as Locale);
  if (!page) return {robots:{index:false,follow:false}};
  return localizedPageMetadata({page,locale:rawLocale as Locale});
}

export default async function ContentRoute({params}: {params:Promise<{locale:string; slug:string[]}>}) {
  const {locale:rawLocale, slug} = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const page = getPageByPath(slug.join('/'), locale);
  if (!page) notFound();
  return <><div id="main-content"><ContentPage page={page} locale={locale} /></div><JsonLd data={jsonLd(page,locale)} /></>;
}
