import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://lightup-client.pages.dev/",
  output: "server",
  image: {
    service: passthroughImageService(),
  },
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  integrations: [
    solidJs(),
    sitemap()
  ],
});
