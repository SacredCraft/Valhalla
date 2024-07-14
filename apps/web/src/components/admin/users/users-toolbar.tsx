"use client";

import { UsersCreate } from "@//components/admin/users/users-create";

export function UsersToolbar() {
  return (
    <div className="relative flex h-12 items-center justify-between border-b px-2">
      <div>
        <UsersCreate />
      </div>
    </div>
  );
}
