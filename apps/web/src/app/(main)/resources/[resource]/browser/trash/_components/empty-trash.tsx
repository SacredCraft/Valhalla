import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import { api } from "@/trpc/react";
import { Button, toast } from "@sacred-craft/valhalla-components";

export const EmptyTrash = () => {
  const { resource } = useResourceContext();
  const router = useRouter();

  const emptyTrash = api.files.emptyTrash.useMutation({
    onSuccess: () => {
      toast.success("Trash emptied");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    emptyTrash.mutate({
      name: resource.name,
    });
  };
  return (
    <Button
      size="sm"
      variant="destructive"
      className="h-7 px-2"
      onClick={() => handleClick()}
    >
      <TrashIcon className="mr-1 h-4 w-4" />
      Empty Trash
    </Button>
  );
};
