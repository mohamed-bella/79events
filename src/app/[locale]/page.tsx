import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {DakhlaPage} from '@/components/pages/dakhla-page';
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
  return {
    ...pageMetadata({title:t('homeTitle'), description:t('homeDescription'), path, indexable:true, locale}),
    openGraph:{type:'website',url:`${getSiteUrl()}${locale === routing.defaultLocale ? '/' : `/${locale}`}`,siteName:company.name,title:t('homeOgTitle'),description:t('homeOgDescription'),locale:locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_GB' : 'fr_FR'},
  };
}

export default async function HomeRoute({params}: {params:Promise<{locale:string}>}) {
  const {locale:rawLocale} = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  return <><div id="main-content"><DakhlaPage /></div><JsonLd data={jsonLd(null, locale)} /></>;
}
