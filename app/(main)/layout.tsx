import { MainClientLayout } from "@/app/(main)/layout.client";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainClientLayout>{children}</MainClientLayout>;
}
