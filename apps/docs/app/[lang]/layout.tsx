import { I18nProvider } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";

import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body>
        <I18nProvider
          locale={lang}
          translations={{
            cn: {
              chooseLanguage: "选择语言",
              name: "Chinese",
            },
          }}
        >
          <RootProvider>{children}</RootProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
