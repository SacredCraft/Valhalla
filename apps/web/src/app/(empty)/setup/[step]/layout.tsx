import { SetupClientLayout } from "@/app/(empty)/setup/[step]/layout.client";

export default function SetupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { step: string };
}) {
  return (
    <SetupClientLayout step={parseInt(params.step, 10)}>
      {children}
    </SetupClientLayout>
  );
}
