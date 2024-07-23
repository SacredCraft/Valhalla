import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { icons } from "lucide-react";

import { map } from "@/.map";
import { defaultLanguage, languages } from "@/utils/i18n";

import { create } from "@/components/ui/icon";

export const { getPage, getPages, getLanguages, pageTree } = loader({
  baseUrl: "/docs",
  rootDir: "docs",
  source: createMDXSource(map),
  icon: (icon) => {
    if (icon && icon in icons)
      return create({ icon: icons[icon as keyof typeof icons] });
  },
  languages,
  defaultLanguage,
});
