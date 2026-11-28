import type {Metadata} from 'next';
import {company, getSiteUrl, isPublicSiteConfigured} from '@/lib/company';
import {getHomePath, pageRegistry, publicPathFor, type Locale, type SitePage} from '@/content/registry';
import {routing} from '@/i18n/routing';

function localePath(path: string, locale: Locale) {
  return locale === routing.defaultLocale ? path || '/' : `/${locale}${path === '/' ? '' : path}`;
}

export function pageMetadata({title, description, path, image, indexable = true, locale}: {
  title: string; description: string; path: string; image?: string; indexable?: boolean; locale?: Locale;
}): Metadata {
  const canonical = `${getSiteUrl()}${locale ? localePath(path, locale) : path}`;
  const languages: Record<string,string> = Object.fromEntries(routing.locales.map((supportedLocale) => [supportedLocale, `${getSiteUrl()}${localePath(path, supportedLocale)}`]));
  languages['x-default'] = `${getSiteUrl()}${localePath(path, routing.defaultLocale)}`;
  return {
    title,
    description,
    alternates: {canonical, languages},
    robots: {index:indexable && isPublicSiteConfigured, follow:true, googleBot:{index:indexable && isPublicSiteConfigured, follow:true}},
    openGraph: {
      type:'website', locale:locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_GB' : 'fr_FR', url:canonical,
      siteName:company.name, title, description,
      ...(image ? {images:[{url:image, width:1600, height:900, alt:title}]} : {}),
    },
    twitter: {card:'summary_large_image', title, description, ...(image ? {images:[image]} : {})},
  };
}

export function localizedPageMetadata({page, locale}: {page:SitePage; locale:Locale}): Metadata {
  const copy = page.copy[locale];
  const base = pageMetadata({title:copy.title, description:copy.description, path:publicPathFor(page, locale), image:page.image, indexable:page.indexable, locale});
  return {
    ...base,
    alternates: {
      canonical:`${getSiteUrl()}${localePath(publicPathFor(page, locale), locale)}`,
      languages:Object.fromEntries([...routing.locales.map((supportedLocale) => [supportedLocale, `${getSiteUrl()}${localePath(publicPathFor(page, supportedLocale), supportedLocale)}`]), ['x-default', `${getSiteUrl()}${localePath(publicPathFor(page, routing.defaultLocale), routing.defaultLocale)}`]]),
    },
  };
}

export function jsonLd(page: SitePage | null, locale: Locale) {
  const base = getSiteUrl();
  const path = localePath(page ? publicPathFor(page, locale) : getHomePath(), locale);
  const copy = page?.copy[locale];
  const nodes: Record<string,unknown>[] = [
    {
      '@context':'https://schema.org', '@type':'Organization', name:company.name,
      legalName:company.legalName,
      foundingDate:company.foundingDate,
      url:base, description:company.description,
      address:{
        '@type':'PostalAddress',
        streetAddress:company.postalAddress.streetAddress,
        addressLocality:company.postalAddress.addressLocality,
        addressCountry:company.postalAddress.addressCountry,
      },
      identifier:company.identifiers.map((identifier) => ({
        '@type':'PropertyValue', propertyID:identifier.propertyID, value:identifier.value,
      })),
      ...(company.email ? {email:company.email} : {}),
    },
    {
      '@context':'https://schema.org', '@type':'WebSite', name:company.name,
      url:base, inLanguage:locale,
    },
    {
      '@context':'https://schema.org', '@type':'WebPage', name:copy?.title || 'Événements d’entreprise et tourisme d’affaires au Maroc',
      description:copy?.description || company.description, url:`${base}${path}`, inLanguage:locale,
    },
  ];
  if (page && ['service','event'].includes(page.kind)) {
    nodes.push({
      '@context':'https://schema.org', '@type':'Service', name:copy?.title,
      description:copy?.description, areaServed:{'@type':'Country',name:'Maroc'}, provider:{'@type':'Organization',name:company.name,url:base},
    });
  }
  if (page) {
    const homeUrl = `${base}${localePath(getHomePath(), locale)}`;
    const parentPath = page.path.split('/').slice(0,-1).join('/');
    const parent = pageRegistry.find((candidate) => candidate.path === parentPath);
    const crumbs = [
      {'@type':'ListItem',position:1,name:locale === 'fr' ? 'Accueil' : locale === 'es' ? 'Inicio' : 'Home',item:homeUrl},
      ...(parent ? [{'@type':'ListItem',position:2,name:parent.copy[locale].title,item:`${base}${localePath(publicPathFor(parent,locale),locale)}`} as Record<string,unknown>] : []),
      {'@type':'ListItem',position:parent ? 3 : 2,name:copy?.title,item:`${base}${localePath(publicPathFor(page,locale),locale)}`},
    ];
    nodes.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs});
  }
  return nodes;
}

export function JsonLd({data}: {data: Record<string,unknown>[]}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}} />;
}
