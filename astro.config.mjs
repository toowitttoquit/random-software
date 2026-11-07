import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.random-software.com",
  trailingSlash: "never",
  build: {
    // Emits manifesto.html rather than manifesto/index.html, which is what lets
    // Vercel's cleanUrls serve /manifesto with no trailing slash, matching the old URLs.
    format: "file",
  },
  integrations: [mdx(), react(), sitemap()],
});
