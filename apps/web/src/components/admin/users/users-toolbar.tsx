"use client";

import { UsersCreate } from "@//components/admin/users/users-create";

export function UsersToolbar() {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div>
        <UsersCreate />
      </div>
    </div>
  );
}
