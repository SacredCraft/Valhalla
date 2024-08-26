import { DocsLayout } from "fumadocs-ui/layout";

import { docsOptions } from "./layout.config";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}
