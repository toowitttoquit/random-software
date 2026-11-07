# Architectural Decisions

## 001: Centralized project config
**Status**: Replaced by decision 008.
**Decision**: All project data lives in `app/config/projects.ts` as a typed array.
**Why**: Homepage cards and navigation gallery dropdown both consume the same data. Single source of truth prevents drift.
**Trade-off**: Adding a project requires updating the config file + creating MDX files (vs. purely file-system-based routing).

## 002: Navigation consolidation
**Decision**: Single `Navigation` component in root layout, gallery items auto-generated from project config.
**Why**: Previously navigation was duplicated in `page.tsx` and `MDXLayout.tsx`. Consolidation eliminates sync issues.

## 003: MDX with layout.tsx wrappers
**Status**: Replaced by decision 008.
**Decision**: Each MDX page has a sibling `layout.tsx` that provides metadata and wraps in `MDXLayout`.
**Why**: Next.js App Router metadata API requires a `.tsx` file. Layout wrappers let MDX pages stay pure content.

## 004: Two component directories
**Decision**: `src/components/ui/` for generic primitives, `src/components/` for project-specific components.
**Why**: UI primitives (shine-border, progressive-carousel) are reusable building blocks. App components encode project-specific domain logic and styling.

## 005: No database, no API routes
**Decision**: Purely static site with no backend.
**Why**: Portfolio/showcase site with no dynamic data needs. Content lives in MDX files committed to the repo.

## 006: Gallery-first design aesthetic
**Decision**: Clean, minimal design with generous whitespace, single-column project layout, curated feel.
**Why**: The site is an exhibition of "software with something to say" - the design should feel intentional, not like a generic dev portfolio.

## 007: Progressive carousel for project images
**Decision**: Auto-advancing carousel with labeled tabs instead of static hero images.
**Why**: Shows multiple facets of each project at a glance. Labels give context without requiring clicks.

## 008: Move from Next.js to Astro content collections
**Decision**: Rebuild the site as static Astro with one MDX file per project, on the existing GitHub and Vercel setup.
**Why**: This is a rehearsal for moving aircfo.com off Webflow onto GitHub, Astro, and Vercel. It also collapses project data that was repeated across a config file, layouts, and pages into one validated file.
**Trade-off**: The site now differs from the owner's other Next.js projects, and adding server features takes more work.

## 009: Static output with no Vercel adapter
**Decision**: Use Astro's default static output without `@astrojs/vercel`. Keep URL and redirect settings in `vercel.json`.
**Why**: Nothing needs a server, so the adapter would add a dependency with no benefit. Images are optimized at build time.
**Trade-off**: Server features such as a waitlist endpoint would need the adapter or a third-party form service.

## 010: Match the rendered old site, not its code
**Decision**: `.prose-site` uses the styles the old site actually rendered, not everything written in `mdx-components.tsx`.
**Why**: The old Tailwind config never scanned that root file, so classes used only there were never generated. On the live site, H2s rendered at 24px rather than the 32px in the code, and list borders never appeared. Carrying the code over faithfully would have changed the design during a migration meant to leave it alone.
**Trade-off**: The styles that were written but never rendered are not carried over. They remain an open design choice.

## 011: Pin @emnapi packages to stable
**Decision**: Use `pnpm.overrides` to pin `@emnapi/core` and `@emnapi/runtime` to 1.11.3.
**Why**: Astro's bundler pulls in a 2.0 beta of `@emnapi/runtime`, which pnpm then shared with `@astrojs/check`. That crashes the import, so `astro check` wrongly reports the package as missing and waits forever at an install prompt, which would hang CI.
**Trade-off**: Remove the override once upstream packages agree on a stable version.

## 012: Keep newer React lint rules off for vendored primitives
**Decision**: Turn off `purity`, `set-state-in-effect`, and `immutability` for `src/components/ui/**` only.
**Why**: `progressive-carousel.tsx` is third-party code whose animation loop intentionally breaks these rules, and it works correctly.
**Trade-off**: That folder gets lighter checking, so keep project code out of it.
