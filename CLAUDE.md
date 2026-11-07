# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server on port 3009
pnpm build      # Build the static site into dist/
pnpm preview    # Serve the built site on port 3009
pnpm typecheck  # Type-check Astro, TypeScript, and MDX
pnpm lint       # Run ESLint
pnpm test       # Run unit tests
pnpm check:site # Check the built site: URLs, SEO tags, broken links
pnpm check      # Run all of the above in order. Run this before saying you're done.
```

## Editing This Site

Most edits come from plain-English requests by someone who isn't an engineer. Explain what you did in plain language, and link the preview.

### How changes ship
1. Never edit `main` directly. Work on a branch and open a pull request.
2. Run `pnpm check` before saying you're done. If it fails, fix the cause or explain the failure plainly.
3. Vercel posts a preview link on the pull request. Share it so the change can be seen before it goes live.
4. Merging publishes the change.

### Where things live
| To change | Edit |
|-----------|------|
| A project's story | Body of `src/content/projects/[name].mdx` |
| A project's title, description, images, or links | Frontmatter of the same file |
| Project order | `order` in each project's frontmatter |
| The manifesto | `src/content/pages/manifesto.mdx` |
| The homepage headline | `src/pages/index.astro` |
| The course page | `src/pages/build.astro` |

### Voice
First person, plain, and opinionated. Tell the story as frustration, then belief, then the decision to build. Avoid marketing speak and technical jargon. See `CONTENT_GUIDE.md` for section-by-section guidance, and `design/brand-guide.md` for the brand.

### URL rules
- **New page:** add its URL to `site-urls.json` in the same pull request.
- **Moved or removed page:** add a permanent redirect to `vercel.json` and remove the URL from `site-urls.json` in the same pull request. `pnpm check` fails if a URL disappears without one.

### Flag these in the pull request
Content edits are routine. Say so explicitly when a change touches any of these, because they can affect the whole site: layout, navigation, redirects, `vercel.json`, `.github/`, `site-urls.json`, dependencies, or these rules.

## Architecture

This is a fully static Astro portfolio site with MDX content, deployed on Vercel at www.random-software.com. There is no server, database, or API.

See `context/architecture.md` for the full system overview and directory structure.

### Key Technologies
- **Astro 7** with content collections
- **MDX** for content pages (manifesto, project pages)
- **React** only for the two interactive pieces: `Navigation` and `ProjectCarousel`
- **Tailwind CSS 3** with custom design tokens
- **TypeScript** (strict mode)
- **Motion** for carousel animation
- **pnpm** as package manager, **Node 24**

### Content Structure
- Projects live in `src/content/projects/*.mdx`. Frontmatter holds the project's data, and the body holds its story.
- Standalone pages live in `src/content/pages/*.mdx`.
- `src/content.config.ts` defines required fields. A missing or invalid field fails the build.
- Project pages follow a 3-section framework: **Origin Story → Design Principles → What It Does**
- See `CONTENT_GUIDE.md` for the project template.

### Brand Colors (defined in tailwind.config.ts)
- `brand-green`: #00B140 (primary)
- `brand-coral`: #FF6B5A (accent)
- `base-bg`: #FAFAFA
- `base-text`: #2C2C2C
- `base-border`: #E5E5E5

### Typography
- Font: Space Grotesk (self-hosted via `@fontsource-variable/space-grotesk`)
- Custom sizes: `text-hero` (64px), `text-display` (48px), `text-h1` (32px)

### Component Locations
- `src/components/` - Astro components, plus the React islands
- `src/components/ui/` - Generic primitives (`ShineBorder`, `progressive-carousel`)
- `src/layouts/` - `BaseLayout` (head, SEO tags, nav, footer) and `ContentLayout` (article wrapper)
- `src/styles/globals.css` - Global styles, including `.prose-site` Markdown typography
- `src/lib/` - Helpers. Pure logic with tests goes in files that don't import `astro:*`, which Vitest can't load.

### Navigation
The gallery dropdown and footer project list are generated from the `projects` collection, so adding a project needs no nav changes. `order` in frontmatter controls the sequence.

### Adding New Projects
1. Add images to `src/assets/projects/[name]/`
2. Create `src/content/projects/[name].mdx` using the template in CONTENT_GUIDE.md

The URL `/projects/[name]`, homepage card, nav item, footer link, and sitemap entry all follow from that file.

### Known Gotchas
- The global CSS applies 200ms transitions to ALL elements, which can cause unexpected animation on dynamically added content.
- MDX list styles are explicitly restored in globals.css because Tailwind resets them.
- `tailwind.config.ts` has a `safelist` for dynamic grid-cols classes used by the carousel.
- `.prose-site` deliberately matches what the old site rendered. See decision 010 in `context/decisions.md`.
- In MDX, use `class`, not `className`, on plain HTML elements.
- Custom components placed inside Markdown need the `not-prose` class, or `.prose-site` will style their contents.
- `build.format: "file"` plus Vercel's `cleanUrls` is what produces `/manifesto` with no trailing slash. Changing either one changes every URL.
- `pnpm.overrides` pins `@emnapi/*` to stable. Without it, `astro check` crashes and then hangs on an install prompt. See decision 011.
