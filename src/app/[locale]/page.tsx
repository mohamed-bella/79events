import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {DakhlaPage} from '@/components/pages/dakhla-page';
import {routing} from '@/i18n/routing';
import {pageMetadata, jsonLd, JsonLd} from '@/lib/seo/metadata';
import {company, getSiteUrl} from '@/lib/company';
import type {Locale} from '@/content/registry';

export async function generateMetadata({params}: {params:Promise<{locale:string}>}): Promise<Metadata> {
  const {locale:rawLocale} = await params;
  if (!hasLocale(routing.locales, rawLocale)) return {};
  const path = '/';
  const canonical = `${getSiteUrl()}${path}`;
  return {
    ...pageMetadata({title:'79events — Agence Événementielle de Prestige au Maroc', description:'Des expériences sur-mesure au Maroc. Mariages, galas, lancements et événements corporate d’exception.', path, indexable:true}),
    alternates:{canonical,languages:{fr:canonical,'x-default':canonical}},
    openGraph:{type:'website',url:canonical,siteName:company.name,title:'79events — Agence Événementielle de Prestige au Maroc',description:'Des expériences sur-mesure au Maroc.',locale:'fr_FR'},
  };
}

export default async function HomeRoute({params}: {params:Promise<{locale:string}>}) {
  const {locale:rawLocale} = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  return <><div id="main-content"><DakhlaPage /></div><JsonLd data={jsonLd(null, locale)} /></>;
}
