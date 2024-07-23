import { createI18nSearchAPI } from "fumadocs-core/search/server";

import { languages } from "@/utils/i18n";
import { getPages } from "@/utils/source";

export const { GET } = createI18nSearchAPI("advanced", {
  indexes: languages.map((lang) => {
    return {
      language: lang,
      indexes: getPages(lang)!.map((page) => ({
        id: page.url,
        url: page.url,
        title: page.data.title,
        structuredData: page.data.exports.structuredData,
      })),
    };
  }),
});
