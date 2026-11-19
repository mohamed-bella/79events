# 79 Events

A Next.js App Router website for 79events. It features luxury event design and production across Morocco, with GSAP hero slider, scroll reveals, gallery showcase, and contact layout. The public site is French only.

The site imagery is stored in `public/images/dakhla-reference/`. The owner confirmed permission to reuse it. Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/fetch-dakhla-assets.ps1` to refresh the nine downloaded assets. `src/content/site-photos.ts` assigns these local images to the inner pages. The contact form opens a prepared email to the published Dakhla Events address.

## Run locally

```bash
npm install
npx playwright install chromium
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The proposal form will validate in development and show a delivery error until the email and shared rate-limit settings below are configured. It will not claim a submission succeeded when delivery is unavailable.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

The Playwright suite starts a local development server on port 3100 and checks the Dakhla homepage, carousel, mobile navigation, gallery, contact details, and horizontal overflow at 375, 768, 1024 and 1440 pixels. It uses the locally installed Chromium browser.

## Lead delivery

Set the following server-side variables in the deployment environment:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The API validates submissions with Zod, uses a honeypot, caps request size and rate-limits each address to five requests per ten minutes. Development uses a process-local limiter. Production requires the shared Upstash limiter so limits continue across server instances. The request route sends the lead to Resend and does not store it in a local database. Delivery errors return a failure state to the form.

Review the privacy-policy draft and complete the legal controller, retention period, contact channel and applicable rights information before enabling live submissions. The current form sends user details to the configured email provider and recipient.

## Business configuration

Set `NEXT_PUBLIC_SITE_URL` to the verified canonical domain. Until a non-placeholder domain is configured, generated pages carry `noindex` and `sitemap.xml` is empty. Configure company contact and social details with the `NEXT_PUBLIC_COMPANY_*` and `NEXT_PUBLIC_*_URL` variables. Empty contact values stay hidden.

## Content and routes

- `src/content/registry.ts` stores published page content, translated page slugs, metadata inputs, relationships and indexability. Only the French routes are public.
- `src/content/roadmap.ts` records future routes as unpublished.
- `src/content/catalog.ts` combines the published pages and planned route records.
- `src/components/pages/` contains reusable home and service/location page templates.
- `src/lib/seo/` builds metadata and structured data.
- `src/i18n/` and `src/messages/` configure `next-intl` and translations.

Unpublished routes resolve to 404. They do not appear in navigation or sitemaps. Add a route only after unique content and the required evidence are ready. See [CONTENT_ROADMAP.md](./CONTENT_ROADMAP.md), [SEO_ARCHITECTURE.md](./SEO_ARCHITECTURE.md) and [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

The development-only `/design-system/` page is blocked in production and marked `noindex`.
