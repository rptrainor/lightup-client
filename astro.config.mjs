import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [solidJs(), sitemap()]
});