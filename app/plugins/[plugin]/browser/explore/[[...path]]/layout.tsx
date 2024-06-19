import { getPluginFiles } from "@/app/actions";
import { ExploreClientLayout } from "@/app/plugins/[plugin]/browser/explore/[[...path]]/layout.client";

type BrowserLayoutProps = {
  params: {
    plugin: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default async function ExploreLayout({
  params: { plugin: pluginId, path: relativePath = [] },
  children,
}: BrowserLayoutProps) {
  const files = (await getPluginFiles(pluginId, relativePath)) ?? [];

  return (
    <ExploreClientLayout relativePath={relativePath} files={files}>
      {children}
    </ExploreClientLayout>
  );
}
