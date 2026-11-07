import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      subtitle: z.string().default(""),
      description: z.string().min(1),
      navLabel: z.string().min(1),
      order: z.number().int().positive(),
      status: z.enum(["active", "planned", "archived"]),
      tags: z.array(z.string().min(1)).min(1),
      gradient: z.string().min(1),
      images: z.array(
        z.object({
          src: image(),
          alt: z.string().min(1),
          label: z.string().min(1),
        }),
      ),
      links: z.array(
        z.object({
          label: z.string().min(1),
          url: z.url(),
          type: z.enum(["github", "demo", "docs", "custom"]).default("custom"),
        }),
      ),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const collections = { projects, pages };
