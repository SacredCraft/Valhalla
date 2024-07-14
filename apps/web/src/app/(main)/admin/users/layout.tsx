import { UsersClientLayout } from "@//app/(main)/admin/users/layout.client";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UsersClientLayout>{children}</UsersClientLayout>;
}
