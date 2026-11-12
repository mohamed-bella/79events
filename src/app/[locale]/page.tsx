import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {HomePage} from '@/components/pages/home-page';
import {routing} from '@/i18n/routing';
import {pageMetadata, jsonLd, JsonLd} from '@/lib/seo/metadata';
import {company, getSiteUrl} from '@/lib/company';
import type {Locale} from '@/content/registry';

export async function generateMetadata({params}: {params:Promise<{locale:string}>}): Promise<Metadata> {
  const {locale:rawLocale} = await params;
  if (!hasLocale(routing.locales, rawLocale)) return {};
  const locale = rawLocale as Locale;
  const t = await getTranslations({locale, namespace:'metadata'});
  const path = '/';
  const canonical = `${getSiteUrl()}${path}`;
  return {
    ...pageMetadata({title:t('homeTitle'), description:t('homeDescription'), path, indexable:true}),
    alternates:{canonical,languages:{fr:canonical,'x-default':canonical}},
    openGraph:{type:'website',url:canonical,siteName:company.name,title:t('homeOgTitle'),description:t('homeOgDescription'),locale:'fr_FR'},
  };
}

export default async function HomeRoute({params}: {params:Promise<{locale:string}>}) {
  const {locale:rawLocale} = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  return <><div id="main-content"><HomePage locale={locale} /></div><JsonLd data={jsonLd(null, locale)} /></>;
}
