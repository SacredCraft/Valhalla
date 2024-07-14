import { MainClientLayout } from "@/app/(main)/layout.client";
import { logout } from "@/app/actions";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || session.user?.id === undefined) return null;

  const user = await api.users.getUserById({ id: session.user.id });

  if (!user) {
    await logout();
    return null;
  }

  return <MainClientLayout {...user}>{children}</MainClientLayout>;
}
