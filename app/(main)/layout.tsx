import { MainClientLayout } from "@/app/(main)/layout.client";
import { logout } from "@/app/actions";
import { auth, signOut } from "@/auth";
import { getUserById } from "@/service/user";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || session.user?.id === undefined) return null;

  const user = await getUserById(session.user.id);

  if (!user) {
    await logout();
    return null;
  }

  return <MainClientLayout {...user}>{children}</MainClientLayout>;
}
