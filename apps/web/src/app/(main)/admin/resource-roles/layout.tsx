import { ResourceRolesClientLayout } from "./layout.client";

export default function ResourceRolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResourceRolesClientLayout>{children}</ResourceRolesClientLayout>;
}
