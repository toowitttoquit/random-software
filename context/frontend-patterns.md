# Frontend Patterns

## Design Identity
Clean gallery aesthetic. Minimal, intentional, generous whitespace. The site feels like a curated exhibition of software projects, not a developer portfolio.

## Colors (tailwind.config.ts)
| Token | Value | Usage |
|-------|-------|-------|
| `brand-green` | #00B140 | Primary actions, links, active states |
| `brand-coral` | #FF6B5A | Accents, highlights, blockquote borders |
| `base-bg` | #FAFAFA | Page background |
| `base-text` | #2C2C2C | Body text |
| `base-border` | #E5E5E5 | Borders, dividers |

Opacity variants used extensively: `text-base-text/70` for secondary text, `text-base-text/50` for tertiary, `/80` for body content.

## Typography
- **Font**: Space Grotesk, self-hosted via Fontsource (variable: `--font-space-grotesk`)
- **Hero**: `text-hero` (4rem/64px, tight leading, slight negative tracking)
- **Display**: `text-display` (3rem/48px)
- **H1**: `text-h1` (2rem/32px)
- Standard Tailwind sizes for body text (`text-xl`, `text-lg`, `text-sm`, etc.)

## Spacing
Gallery-style generous spacing. Custom values:
- `space-y-30` (120px) between project cards
- `py-20` for major sections
- `py-16` for subsections
- `mt-30` before footer

## Component Conventions

### Cards
- `rounded-lg border border-base-border bg-base-bg overflow-hidden md:shadow-xl`
- Content padding: `px-8 py-8 md:px-10`

### Hover Effects
- Links: color transition to brand-green
- Nav underline: `h-0.5 bg-brand-coral` growing from left on hover
- Cards/principles: `hover:border-brand-green/50`

### Interactive Elements
- Primary buttons: `bg-brand-green text-white rounded-lg hover:bg-brand-green/90`
- Text links: `text-brand-green hover:text-brand-coral underline`
- Arrow links: `inline-flex items-center gap-2` with animated gap on hover

## MDX Content Styling
All Markdown typography lives in the `.prose-site` block of `src/styles/globals.css`:
- Blockquotes use `border-l-4 border-brand-coral`
- Code uses `bg-base-text/5 text-brand-green`
- Lists restore disc/decimal markers (Tailwind resets them)
- Components placed inside Markdown carry `not-prose` so these rules skip them

## Global CSS Notes (globals.css)
- All elements get smooth 200ms transitions on color/bg/border/transform/opacity/shadow
- `prefers-reduced-motion` disables transitions
- Article list styles explicitly restored for MDX content

## Anti-Patterns
- No dark mode (light only, gallery aesthetic)
- No generic/default styling - everything uses the design system
- No class components
- Avoid inline styles - use Tailwind tokens
