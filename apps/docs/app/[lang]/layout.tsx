import { I18nProvider } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import localFont from "next/font/local";

import "./global.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function Layout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
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
