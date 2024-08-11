import { LogsClientLayout } from "./layout.client";

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LogsClientLayout>{children}</LogsClientLayout>;
}
