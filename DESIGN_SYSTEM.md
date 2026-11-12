# Design system

## Direction

An event presentation inspired by the reference site's structure: a large scenic hero, overlapping royal-blue service panels, white space and rounded corporate actions. It keeps 79 Events' own name and photography rather than reusing S'TOURS branding or assets.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#17284d` | Text, footer and dark sections |
| Ocean | `#174acb` | Navigation and service panels |
| Accent blue | `#5c82c1` | Secondary accents |
| Paper | `#f4f6fb` | Section backgrounds |
| Surface | `#ffffff` | Content surfaces and forms |
| Text | `#526078` | Body text |
| Muted | `#748096` | Supporting copy |
| Line | `#e1e7f0` | Dividers and form boundaries |
| Footer | `#101a33` | Footer background |

CSS variables live in `src/app/globals.css`; Tailwind v4 exposes matching color and font tokens. The main container is 1280px, with 32px desktop and 16px mobile gutters. Section spacing uses fluid `clamp()` values.

## Type

- Headings: Manrope, provided through `next/font`
- Body: Inter, provided through `next/font`
- Fluid H1: roughly 38–76px; mobile starts near 40px
- Fluid H2: roughly 32–54px
- Body: 15px base with 1.65 line height
- Eyebrows: 11px uppercase with wide tracking

## Shared components

The header opens a French navigation panel on desktop and mobile. Other shared pieces include button variants, breadcrumbs, page hero, service rows, process steps, FAQ disclosures, related links, inquiry form, a floating contact action, footer and JSON-LD helper.

The development-only `/design-system/` route demonstrates colors, typography, buttons, list rows and FAQ behavior. It returns 404 in production, has `noindex` and is excluded from the sitemap.

## Accessibility rules

- Use visible focus rings, semantic headings, labelled inputs and keyboard-accessible disclosure controls.
- Keep the first hero image eager and marked as the LCP asset; give other images explicit dimensions or a fixed fill container.
- Keep content readable without client-side JavaScript.
- Respect `prefers-reduced-motion` and avoid autoplay media.
- Keep status messages and field errors attached to the form state.
