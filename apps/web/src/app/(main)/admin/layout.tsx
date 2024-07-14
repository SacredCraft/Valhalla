import { notFound, redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { isAdmin } from "@/server/service/user";

import { AdminClientLayout } from "./layout.client";

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

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
