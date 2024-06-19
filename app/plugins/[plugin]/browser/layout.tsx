import { BrowserClientLayout } from "@/app/plugins/[plugin]/browser/layout.client";

type BrowserLayoutProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default async function BrowserLayout({
  params: { plugin: pluginId },
  children,
}: BrowserLayoutProps) {
  return (
    <BrowserClientLayout pluginId={pluginId}>{children}</BrowserClientLayout>
  );
}
