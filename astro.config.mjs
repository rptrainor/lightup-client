import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://lightup-client.pages.dev/",
  output: "server",
  prefetch: true,
  image: {
    service: passthroughImageService(),
  },
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  integrations: [
    solidJs(),
    sitemap(),
    tailwind(),
    partytown({
      config: {
        forward: ['Intercom'],
      },
    }),
  ],
});
