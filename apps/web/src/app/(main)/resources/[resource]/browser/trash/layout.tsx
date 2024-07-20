import { TrashClientLayout } from "@/app/(main)/resources/[resource]/browser/trash/layout.client";
import { getDeletedFiles } from "@/lib/core";

type TrashLayoutProps = {
  params: {
    resource: string;
  };
  children: React.ReactNode;
};

export default async function TrashLayout({
  params: { resource },
  children,
}: TrashLayoutProps) {
  const trash = (await getDeletedFiles(resource, [])) ?? [];

  return <TrashClientLayout trash={trash}>{children}</TrashClientLayout>;
}
