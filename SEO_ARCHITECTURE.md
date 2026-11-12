# SEO architecture

## Route and content source

`src/content/registry.ts` is the published content registry. Each page has French public copy and a French slug, publication and index flags, update date, hero image, relationships and reusable structured sections. `src/content/roadmap.ts` contains planned routes with `published: false` and `indexable: false`. `src/content/catalog.ts` combines both sets for editorial review.

Unpublished routes return 404 and stay out of navigation, internal links and sitemaps. The portfolio landing page is available but `noindex` until an approved case study can support the search intent. The privacy-policy draft is also `noindex` until legal review.

## Metadata

`src/lib/seo/metadata.tsx` centralizes page metadata. Each published page receives a unique French title and description, canonical URL, robots settings, Open Graph metadata and French language alternates. Public paths have no locale prefix.

The canonical domain is read from `NEXT_PUBLIC_SITE_URL`. If it is absent or still contains the example placeholder, pages are `noindex` and the sitemap is empty. Set the verified domain before publishing.

## Internationalization

`next-intl` is configured with French as the only public locale, without a `/fr/` prefix. French slugs are stored beside page content. `src/proxy.ts` runs locale routing and excludes APIs, framework assets and file paths.

Metadata and `sitemap.xml` provide only `fr` and `x-default` alternates. The proxy's automatic alternate-link header is disabled so it cannot emit unsupported language URLs. Canonicals use the root URL and French page slugs.

## Structured data

`jsonLd()` emits Organization, WebSite and WebPage data without inventing a street address, ratings, prices, clients or statistics. Service schema appears only for event and service pages, with Maroc as the service area. Generic service pages do not emit Event schema. Published content routes also emit BreadcrumbList JSON-LD from their registered hierarchy.

Approved case studies may add Article or creative-work schema after client permissions and documented facts are available. Event schema is reserved for a real, factual, public event record.

## Sitemap and crawling

`src/app/sitemap.ts` includes only published, indexable French pages and modification dates. `src/app/robots.ts` allows public pages and excludes APIs and the development-only design-system route. The portfolio and legal draft remain available to visitors but have `noindex` and are omitted from the sitemap.

## Page templates and internal links

Service, event and city records use the reusable content-page template for brief, capabilities, process, local note, FAQs, related links and proposal CTA. Navigation draws from published records only. Relationships are stored by content key; this keeps hubs connected to service, location and event pages without generated slug substitutions.

## Launch review

Before indexing, verify the production domain, company name, contact channels, legal policy, form recipient and consent wording. Confirm image rights and final alt text, then review canonicals and language alternates on published URLs.
