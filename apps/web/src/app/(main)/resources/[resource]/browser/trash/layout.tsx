import { TrashClientLayout } from "@/app/(main)/resources/[resource]/browser/trash/layout.client";
import { api } from "@/trpc/server";

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
  const trash = await api.files.getTrash({ resource });

  return <TrashClientLayout trash={trash}>{children}</TrashClientLayout>;
}
