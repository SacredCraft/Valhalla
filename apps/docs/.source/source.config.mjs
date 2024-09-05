// source.config.ts
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { remarkInstall } from "fumadocs-docgen";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var { docs, meta } = defineDocs({});
var source_config_default = defineConfig({
  generateManifest: true,
  lastModifiedTime: "git",
  mdxOptions: {
    rehypeCodeOptions: {
      inline: "tailing-curly-colon",
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha"
      },
      transformers: [...rehypeCodeDefaultOptions.transformers ?? []]
    },
    remarkPlugins: [[remarkInstall, { persist: { id: "package-manager" } }]]
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
