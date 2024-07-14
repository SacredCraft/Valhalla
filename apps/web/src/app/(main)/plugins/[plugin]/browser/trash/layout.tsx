import { TrashClientLayout } from "@//app/(main)/plugins/[plugin]/browser/trash/layout.client";
import { getDeletedFiles } from "@/lib/core";

type TrashLayoutProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default async function TrashLayout({
  params: { plugin: pluginId },
  children,
}: TrashLayoutProps) {
  const trash = (await getDeletedFiles(pluginId, [])) ?? [];

  return <TrashClientLayout trash={trash}>{children}</TrashClientLayout>;
}
