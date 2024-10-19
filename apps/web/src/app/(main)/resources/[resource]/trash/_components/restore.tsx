import { ArchiveRestore } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Trash } from "@/server/api/routers/files";
import { api } from "@/trpc/react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@sacred-craft/valhalla-components";
import { Row } from "@tanstack/react-table";

import { useResourceContext } from "../../files/[[...slug]]/layout.client";

interface RestoreProps {
  row: Row<Trash>;
}

export const Restore = ({ row }: RestoreProps) => {
  const router = useRouter();
  const { resource } = useResourceContext();

  const restore = api.files.restoreFromTrash.useMutation({
    onSuccess: () => {
      toast.success("Restored successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRestore = () => {
    restore.mutate({
      trashName: row.original.trashName,
      resource: resource.name,
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={() => handleRestore()}
        >
          <ArchiveRestore className="size-4" />
          <span className="sr-only">Restore</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Restore</TooltipContent>
    </Tooltip>
  );
};
