# Lightup Web App Client 
## Server Side Rendered on Cloudflare Pages

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm run pages\:dev`     | Run the development server at `localhost:4321`   |
| `pnpm run pages\:deploy`  | Deploy your application                          |
| `pnpm run pages\:deploy`  | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying    |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check`|
| `pnpm run astro -- --help` | Get help using the Astro CLI                    |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
Read the documentation https://developers.cloudflare.com/pages
Stuck? Join us at https://discord.gg/cloudflaredev