import { BrowserClientLayout } from "@/app/plugins/[plugin]/browser/layout.client";

type BrowserLayoutProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default async function BrowserLayout({ children }: BrowserLayoutProps) {
  return <BrowserClientLayout>{children}</BrowserClientLayout>;
}
