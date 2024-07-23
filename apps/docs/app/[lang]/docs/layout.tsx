import { DocsLayout } from "fumadocs-ui/layout";

import { docsOptions } from "./layout.config";

export default function Layout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  return <DocsLayout {...docsOptions(lang)}>{children}</DocsLayout>;
}
