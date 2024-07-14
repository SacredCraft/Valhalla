import { notFound, redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { isAdmin } from "@/server/service/user";

import { AdminMenu } from "@/components/admin/admin-menu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/");
  }

  const sessionId = session.user.id!!;

  if (!(await isAdmin(sessionId))) {
    return notFound();
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <AdminMenu />
      <div className="flex-1">{children}</div>
    </div>
  );
}
