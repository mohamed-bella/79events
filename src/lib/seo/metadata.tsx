import type {Metadata} from 'next';
import {company, getSiteUrl, isPublicSiteConfigured} from '@/lib/company';
import {getHomePath, pageRegistry, publicPathFor, type Locale, type SitePage} from '@/content/registry';

export function pageMetadata({title, description, path, image, indexable = true}: {
  title: string; description: string; path: string; image?: string; indexable?: boolean;
}): Metadata {
  const canonical = `${getSiteUrl()}${path}`;
  const languages: Record<string,string> = {fr:canonical, 'x-default':canonical};
  return {
    title,
    description,
    alternates: {canonical, languages},
    robots: {index:indexable && isPublicSiteConfigured, follow:true, googleBot:{index:indexable && isPublicSiteConfigured, follow:true}},
    openGraph: {
      type:'website', locale:'fr_FR', url:canonical,
      siteName:company.name, title, description,
      ...(image ? {images:[{url:image, width:1600, height:900, alt:title}]} : {}),
    },
    twitter: {card:'summary_large_image', title, description, ...(image ? {images:[image]} : {})},
  };
}

export function localizedPageMetadata({page, locale}: {page:SitePage; locale:Locale}): Metadata {
  const copy = page.copy[locale];
  const base = pageMetadata({title:copy.title, description:copy.description, path:publicPathFor(page, locale), image:page.image, indexable:page.indexable});
  return {
    ...base,
    alternates: {
      canonical:`${getSiteUrl()}${publicPathFor(page, locale)}`,
      languages:{fr:`${getSiteUrl()}${publicPathFor(page,'fr')}`, 'x-default':`${getSiteUrl()}${publicPathFor(page,'fr')}`},
    },
  };
}

export function jsonLd(page: SitePage | null, locale: Locale) {
  const base = getSiteUrl();
  const path = page ? publicPathFor(page, locale) : getHomePath();
  const copy = page?.copy[locale];
  const nodes: Record<string,unknown>[] = [
    {
      '@context':'https://schema.org', '@type':'Organization', name:company.name,
      url:base, description:company.description,
      ...(company.email ? {email:company.email} : {}),
      ...(company.phone ? {telephone:company.phone} : {}),
    },
    {
      '@context':'https://schema.org', '@type':'WebSite', name:company.name,
      url:base, inLanguage:'fr',
    },
    {
      '@context':'https://schema.org', '@type':'WebPage', name:copy?.title || 'Événements d’entreprise et tourisme d’affaires au Maroc',
      description:copy?.description || company.description, url:`${base}${path}`, inLanguage:'fr',
    },
  ];
  if (page && ['service','event'].includes(page.kind)) {
    nodes.push({
      '@context':'https://schema.org', '@type':'Service', name:copy?.title,
      description:copy?.description, areaServed:{'@type':'Country',name:'Maroc'}, provider:{'@type':'Organization',name:company.name,url:base},
    });
  }
  if (page) {
    const homeUrl = `${base}${getHomePath()}`;
    const parentPath = page.path.split('/').slice(0,-1).join('/');
    const parent = pageRegistry.find((candidate) => candidate.path === parentPath);
    const crumbs = [
      {'@type':'ListItem',position:1,name:'Accueil',item:homeUrl},
      ...(parent ? [{'@type':'ListItem',position:2,name:parent.copy[locale].title,item:`${base}${publicPathFor(parent,locale)}`} as Record<string,unknown>] : []),
      {'@type':'ListItem',position:parent ? 3 : 2,name:copy?.title,item:`${base}${publicPathFor(page,locale)}`},
    ];
    nodes.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs});
  }
  return nodes;
}

export function JsonLd({data}: {data: Record<string,unknown>[]}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}} />;
}
