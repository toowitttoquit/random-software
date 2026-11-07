# API Reference

This is a static site with no API routes or server actions. Every page is pre-built into HTML by Astro.

## Pages
| Route | Source | Description |
|-------|--------|-------------|
| `/` | `src/pages/index.astro` | Homepage with hero and project cards |
| `/build` | `src/pages/build.astro` | Course landing page (coming soon) |
| `/manifesto` | `src/content/pages/manifesto.mdx` | Manifesto essay |
| `/projects/[id]` | `src/content/projects/[id].mdx` | Project pages (`taru`, `docket`) |
| `/404` | `src/pages/404.astro` | Not found page |
| `/sitemap-index.xml` | `@astrojs/sitemap` | Generated at build time |
| `/robots.txt` | `public/robots.txt` | Crawler rules |
