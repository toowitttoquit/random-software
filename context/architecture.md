# Architecture

## Stack
- **Framework**: Astro 7, static output only
- **Content**: MDX content collections, validated by `src/content.config.ts`
- **Interactivity**: React islands for `Navigation` and `ProjectCarousel` only
- **Styling**: Tailwind CSS 3 with custom design tokens
- **Language**: TypeScript (strict mode)
- **Font**: Space Grotesk, self-hosted via Fontsource
- **Animations**: Motion
- **Images**: Astro image pipeline (sharp), WebP at build time
- **Tests**: Vitest
- **Package Manager**: pnpm, on Node 24
- **Deployment**: Vercel, configured by `vercel.json`
- **Domain**: www.random-software.com

## Directory Structure

```
src/
  content.config.ts       # Collection schemas (required fields)
  content/
    projects/             # One .mdx per project: frontmatter data + story
    pages/                # Standalone pages (manifesto)
  assets/projects/        # Project images, referenced from frontmatter
  pages/
    index.astro           # Homepage
    build.astro           # "Vibecoding for Operators" course page
    manifesto.astro       # Renders content/pages/manifesto.mdx
    projects/[id].astro   # Renders each project
    404.astro             # Not found page
  layouts/
    BaseLayout.astro      # <head>, SEO tags, Navigation, Footer
    ContentLayout.astro   # Article wrapper for MDX pages
  components/
    Navigation.tsx        # React island: gallery dropdown, mobile menu
    ProjectCarousel.tsx   # React island: image carousel
    Logo.tsx              # Rendered by Navigation
    ProjectCard.astro     # Homepage card
    ProjectHero.astro     # Project page hero
    ProjectLinks.astro    # External link buttons
    DesignPrinciple.astro # Principle card, used inside MDX
    Footer.astro
    ui/
      ShineBorder.astro   # Animated border on the homepage hero
      progressive-carousel.tsx  # Auto-advancing carousel primitive
  lib/
    projects.ts           # Collection queries, image optimization
    project-order.ts      # Sorting logic
    seo.ts                # Page titles, canonical URLs
    utils.ts              # cn() class merging
    __tests__/            # Vitest tests
  styles/globals.css      # Global styles, .prose-site typography
public/                   # favicon.ico, robots.txt
```

## Key Patterns

### Project Data Flow
Each `src/content/projects/*.mdx` file is the single source of truth for that project. The homepage, project page, nav, footer, and sitemap all read from the collection through `src/lib/projects.ts`.

### Islands
Astro sends no JavaScript by default. Components only ship JavaScript when they use a `client:` directive. `Navigation` uses `client:load` because it's visible immediately, and `ProjectCarousel` uses `client:visible`, so its animation starts when it scrolls into view. Both are also rendered to HTML at build time.

### Images
React islands can't use Astro's `<Image>`, so `getCarouselImages()` optimizes project images at build time and passes the URLs in as props. Frontmatter uses the `image()` schema helper, so a wrong image path fails the build.

### SEO
`BaseLayout` sets the title, description, canonical URL, and social tags for every page. Titles go through `formatPageTitle()`, so pass only the page's own name.

### URLs
`build.format: "file"` emits `manifesto.html`, and Vercel's `cleanUrls` and `trailingSlash: false` serve it at `/manifesto`. The site's canonical host is `www`.

## Environment
No environment variables required. This is a purely static site with no API routes, database, or auth.

## Local Development
```bash
pnpm install
pnpm dev      # http://localhost:3009
pnpm check    # Type-check, lint, test, and build
```
