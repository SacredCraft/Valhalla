import { createI18nMiddleware } from "fumadocs-core/middleware";

import { defaultLanguage, languages } from "@/utils/i18n";

export default createI18nMiddleware({
  languages,
  defaultLanguage,
  hideLocale: "default-locale",
});

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
