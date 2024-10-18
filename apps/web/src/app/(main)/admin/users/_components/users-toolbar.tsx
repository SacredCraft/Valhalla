"use client";

import { UsersCreate } from "@/app/(main)/admin/users/_components/users-create";

import { SelectedDelete } from "./selected-delete";

export function UsersToolbar() {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div className="flex gap-2">
        <UsersCreate />
        <SelectedDelete />
      </div>
    </div>
  );
}
