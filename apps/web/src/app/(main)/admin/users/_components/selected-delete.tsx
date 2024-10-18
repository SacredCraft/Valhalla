import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

import { api } from "@/trpc/react";
import { Button, toast } from "@sacred-craft/valhalla-components";

import { useUsersContext } from "../layout.client";

export const SelectedDelete = () => {
  const { data, rowSelection, setRowSelection } = useUsersContext();
  const selectedRows = useMemo(
    () =>
      rowSelection
        ? Object.keys(rowSelection).map((index) => data[parseInt(index, 10)])
        : [],
    [data, rowSelection],
  );

  const deleteUsers = api.users.deleteUserById.useMutation();
  const router = useRouter();

  const handleDelete = async () => {
    const errors: string[] = [];

    await Promise.all(
      selectedRows.map((user) =>
        deleteUsers.mutateAsync({ id: user.id }).catch((error) => {
          errors.push(error.message);
        }),
      ),
    );

    if (errors.length > 0) {
      toast.error("Failed to delete users");
    } else {
      toast.success("Users deleted successfully");
      setRowSelection({});
      router.refresh();
    }
  };

  return (
    selectedRows.length > 0 && (
      <Button
        size="sm"
        variant="destructive"
        className="h-7 px-2"
        onClick={handleDelete}
      >
        <Trash className="mr-1 h-4 w-4" />
        Delete {selectedRows.length} users
      </Button>
    )
  );
};
