"use client";

import { UsersCreate } from "@/app/(main)/admin/users/_components/users-create";

export function UsersToolbar() {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div>
        <UsersCreate />
      </div>
    </div>
  );
}
