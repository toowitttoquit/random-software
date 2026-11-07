# Content Management Guide

All written content is MDX: Markdown that can also include components. Content lives in `src/content/`, and each file's frontmatter (the block between the `---` lines) is checked against the rules in `src/content.config.ts`. A missing required field stops the build and names the file and field.

## Directory Structure

```
src/
├── content/
│   ├── pages/
│   │   └── manifesto.mdx     # Manifesto essay
│   └── projects/
│       ├── docket.mdx        # The Docket
│       └── taru.mdx          # Taru
└── assets/
    └── projects/
        ├── docket/           # Docket images
        └── taru/             # Taru images
```

## Writing Content

Standard Markdown works everywhere:

- **Headings**: `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Links**: `[text](url)`
- **Lists**: `- item` or `1. item`
- **Code**: `` `inline` `` or fenced blocks
- **Quotes**: `> quote text`
- **Images**: `![description](../../assets/projects/your-project/image.png)`

Plain HTML also works in MDX. Use `class`, not `className`.

Markdown is styled by the `.prose-site` block in `src/styles/globals.css`.

## Creating a New Project Page

Project pages follow a 3-section framework: **Origin Story → Design Principles → What It Does**

1. Add images to `src/assets/projects/your-project/`
2. Create `src/content/projects/your-project.mdx` from the template below

That's all. The filename becomes the URL (`/projects/your-project`), and the homepage card, nav item, footer link, and sitemap entry all update automatically.

### Project Template

```mdx
---
title: Project Name
subtitle: Optional secondary text
description: A 1-2 sentence description, also used for search results and social previews.
navLabel: Project Name
order: 3
status: active
tags: [Technology, Stack, Keywords]
gradient: bg-gradient-to-br from-brand-green/20 to-brand-coral/20
images:
  - src: ../../assets/projects/your-project/home.png
    alt: What the screenshot shows
    label: Home
links:
  - label: Launch Project
    url: https://your-project.random-software.com
    type: demo
---

import DesignPrinciple from "@/components/DesignPrinciple.astro";

## Origin Story

Write 2-4 paragraphs in first person: why you built this, the "aha" moment, and what you believed should exist.

## Design Principles

<div class="grid md:grid-cols-2 gap-6 my-12">
  <DesignPrinciple
    icon="🎯"
    title="First Principle"
    description="The conscious decision you made, and the trade-off you embraced."
  />

  <DesignPrinciple
    icon="⚡"
    title="Second Principle"
    description="Another core belief that shaped how you built this."
    variant="highlighted"
  />
</div>

## What It Does

### Feature Section

Describe practical capabilities. Keep it straightforward.
```

### Frontmatter Fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Project name. Don't add "Random Software", which is appended automatically. |
| `subtitle` | No | Secondary text beside the title |
| `description` | Yes | Shown on the card and hero, and used for SEO |
| `navLabel` | Yes | Text in the Gallery dropdown |
| `order` | Yes | Whole number. Lower numbers appear first. |
| `status` | Yes | `active`, `planned`, or `archived` |
| `tags` | Yes | At least one |
| `gradient` | Yes | Tailwind classes, shown if there are no images |
| `images` | Yes | List of `src`, `alt`, `label`. Can be empty (`[]`). |
| `links` | Yes | List of `label`, `url`, `type`. Shown above and below the story. Can be empty (`[]`). |

Link `type` is `github`, `demo`, `docs`, or `custom`.

### DesignPrinciple

- `title` (required): Principle name
- `description` (required): 1-2 sentence explanation
- `icon` (optional): An emoji
- `variant` (optional): `default` or `highlighted` (coral border)

### Image Guidelines

1. **Location**: `src/assets/projects/[project-name]/`
2. **Naming**: Descriptive names (`home.png`, `dashboard-view.png`)
3. **Formats**: PNG for screenshots, JPG for photos
4. **Size**: Upload full size. The build converts images to optimized WebP, so no manual compression is needed.

### Content Writing Tips

**Origin Story**:
- Length: 2-4 paragraphs
- Voice: First person ("I built this because...")
- Focus: Frustration → belief → decision to build
- Avoid: Marketing speak, technical jargon

**Design Principles**:
- Count: 3-5 principles
- Voice: Confident, opinionated
- Focus: Trade-offs and conscious decisions
- Avoid: Generic principles that could apply to any product

**What It Does**:
- Length: 2-3 subsections with visuals
- Voice: Clear, straightforward
- Focus: Practical capabilities and how to access it
- Include: Screenshots, diagrams, or GIFs showing the product in action

## Tips

- Keep content focused and readable
- Use headings to structure your writing
- Preview changes locally with `pnpm dev`

## Examples

- `src/content/pages/manifesto.mdx` - Essay-style content
- `src/content/projects/taru.mdx` - A project with several images
