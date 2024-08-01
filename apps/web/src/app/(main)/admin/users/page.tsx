import { UsersTable } from "@/app/(main)/admin/users/_components/users-table";
import { UserCol } from "@/app/(main)/admin/users/_components/users-table-columns";
import { User, db } from "@sacred-craft/valhalla-database";

export default async function UsersPage() {
  const users: UserCol[] = (await db.user.findMany()).map((user: User) => ({
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
    <div className="my-2">
      <UsersTable users={users} />
    </div>
  );
}
