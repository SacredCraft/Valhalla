import { notFound, redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

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

  const user = await db.user.findUnique({
    where: { id: sessionId, role: "ADMIN" },
  });

  if (!user || user.role !== "ADMIN") {
    return notFound();
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
