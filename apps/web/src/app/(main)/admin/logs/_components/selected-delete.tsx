import { Trash } from "lucide-react";
import React, { useMemo } from "react";

import { api } from "@/trpc/react";
import { Button, toast } from "@sacred-craft/valhalla-components";

import { useLogsContext } from "../layout.client";

export const SelectedDelete = ({ refetch }: { refetch: () => void }) => {
  const { table, rowSelection, setRowSelection } = useLogsContext();

  const selectedRows = useMemo(() => {
    const allRows = table?.getRowModel().rows ?? [];
    return Object.keys(rowSelection).map(
      (index) => allRows[parseInt(index)].original,
    );
  }, [table, rowSelection]);

  const deleteLogs = api.logs.deleteByIds.useMutation();

  const handleDelete = async () => {
    const ids = selectedRows.map((log) => log.id);

    deleteLogs.mutate(
      { ids },
      {
        onError: () => {
          toast.error("Logs deletion failed");
        },
        onSuccess: async () => {
          toast.success("Logs deleted successfully");
          setRowSelection({});
          refetch();
        },
      },
    );
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
        Delete {selectedRows.length} logs
      </Button>
    )
  );
};
