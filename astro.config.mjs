import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: 'https://lightup-client.pages.dev/',
  output: "server",
  image: {
    service: passthroughImageService()
  },
  adapter: cloudflare({
    imageService: "passthrough"
  }),
  integrations: [
    solidJs(),
    tailwind({
    // Example: Disable injecting a basic `base.css` import on every page.
    // Useful if you need to define and/or import your own custom `base.css`.
    applyBaseStyles: false
  }),
  sitemap(),
  partytown({
    config: {
      forward: ['dataLayer.push', "posthog","intercomSettings"]
    },
  })]
});