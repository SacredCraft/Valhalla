import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

import { map } from "@/.map";
import { defaultLanguage, languages } from "@/utils/i18n";

export const { getPage, getPages, getLanguages, pageTree } = loader({
  baseUrl: "/docs",
  rootDir: "docs",
  source: createMDXSource(map),
  languages,
  defaultLanguage,
});
