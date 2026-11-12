import type {Locale, PageKind} from './registry';

export interface SEOFields {
  title: string;
  metaDescription: string;
  canonicalUrl?: string;
  h1: string;
  slug: string;
  locale: Locale;
  seoImage?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  robots: 'index,follow' | 'noindex,follow';
  published: boolean;
  updatedAt: string;
  breadcrumbs: {label:string; href:string}[];
  relatedPages: string[];
  structuredData: 'WebPage' | 'Service' | 'Article' | 'Event' | 'None';
}

export interface CMSContent<TBody = string> {
  title: string;
  slug: string;
  description: string;
  content: TBody;
  heroImage?: {src:string; alt:string; width?:number; height?:number};
  seo: SEOFields;
  locale: Locale;
  published: boolean;
  updatedAt: string;
  relatedServices: string[];
  relatedLocations: string[];
  relatedCaseStudies: string[];
}

export interface EventService extends CMSContent {
  kind: 'service';
  serviceType: string;
  capabilities: {title:string; description:string}[];
}

export interface EventCategory extends CMSContent {
  kind: 'event';
  audience: string[];
  planningConsiderations: string[];
}

export interface Location extends CMSContent {
  kind: 'location';
  city: string;
  eventFormats: string[];
  localPlanningNotes: string[];
}

export interface Venue extends CMSContent {
  kind: 'venue';
  venueName: string;
  city: string;
  verifiedCapacity?: {theatre?:number; banquet?:number; classroom?:number; verifiedAt:string; source:string};
  verifiedFacilities: {name:string; verifiedAt:string; source:string}[];
  accessibilityNotes?: {detail:string; verifiedAt:string; source:string};
  availabilityCheckedAt?: string;
}

export interface CaseStudy extends CMSContent {
  kind: 'case-study';
  eventType: string;
  city: string;
  eventDate?: string;
  clientName?: string;
  clientApproval?: {approvedBy:string; approvedAt:string; scope:string};
  documentedResults: {label:string; value:string; source:string}[];
}

export interface Industry extends CMSContent {
  kind: 'industry';
  needs: string[];
  relatedEventTypes: string[];
}

export interface BlogArticle extends CMSContent<string> {
  kind: 'article';
  bodyMdx: string;
  author?: {name:string; role:string};
  reviewer?: {name:string; role:string};
  publishedAt: string;
  tableOfContents: {id:string; label:string}[];
}

export type ContentKind = PageKind | 'venue' | 'case-study' | 'industry' | 'article';
