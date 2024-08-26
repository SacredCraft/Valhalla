import { createSearchAPI } from "fumadocs-core/search/server";

import { getPages } from "@/utils/source";

export const { GET } = createSearchAPI("advanced", {
  indexes: getPages()!.map((page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    structuredData: page.data.exports.structuredData,
  })),
});
