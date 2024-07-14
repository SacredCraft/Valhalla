import { notFound, redirect } from "next/navigation";

import { AdminMenu } from "@//components/admin/admin-menu";
import { auth } from "@/server/auth";
import { isAdmin } from "@/server/service/user";

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
