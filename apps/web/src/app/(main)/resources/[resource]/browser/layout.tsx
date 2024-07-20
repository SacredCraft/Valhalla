import { BrowserClientLayout } from "@/app/(main)/resources/[resource]/browser/layout.client";

type BrowserLayoutProps = {
  children: React.ReactNode;
};

export default async function BrowserLayout({ children }: BrowserLayoutProps) {
  return <BrowserClientLayout>{children}</BrowserClientLayout>;
}
