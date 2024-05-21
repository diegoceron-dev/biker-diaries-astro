import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import auth from "auth-astro";
import db from "@astrojs/db";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: "server",
  integrations: [mdx(), sitemap(), tailwind(), vue(), auth(), db()],
  adapter: vercel()
});