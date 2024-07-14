import { UsersTable } from "@//components/admin/users/users-table";
import { UserCol } from "@//components/admin/users/users-table-columns";
import prisma from "@/lib/prisma";

export default async function UsersPage() {
  const users: UserCol[] = (await prisma.user.findMany()).map((user) => ({
    id: user.id,
    bio: user.bio,
    avatar: user.avatar,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
  }));

  return (
    <div className="mt-2">
      <UsersTable users={users} />
    </div>
  );
}
