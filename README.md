# Random Software

A portfolio site showcasing software projects and experiments, live at [www.random-software.com](https://www.random-software.com). Individual projects are hosted on subdomains.

## Tech Stack

- **Framework**: Astro (fully static)
- **Content**: MDX content collections
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

Requires Node.js 24 and pnpm.

```bash
pnpm install
pnpm dev      # http://localhost:3009
pnpm check    # Type-check, lint, test, and build
```

## Project Structure

```
src/
├── content/          # Projects and pages, as MDX files
├── assets/           # Project images, optimized at build time
├── components/       # Astro components and React islands
├── layouts/          # Page shells and SEO tags
├── lib/              # Helpers and their tests
├── pages/            # Routes
└── styles/           # Global CSS
public/               # Files served as-is (favicon, robots.txt)
context/              # Architecture, patterns, and decision docs
```

## Deployment

Vercel builds a preview for every pull request and deploys `main` to production. Redirects and URL settings live in `vercel.json`.

## Adding a Project

See `CONTENT_GUIDE.md`.

## License

ISC
