"use client";

import { Code, CodeXml, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { useFilesEditorContext } from "@//app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import { useNode } from "@//components/templates-components/form/node";
import { Button } from "@//components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@//components/ui/tooltip";
import {
  getFormValue,
  isFormDeletableValue,
  setFormDeleteValue,
} from "@/lib/form";
import { cn } from "@/lib/utils";

type ActionsAreaProps = {
  onDelete?: (nodes: string[]) => void;
  onTempDelete?: (nodes: string[]) => void;
  children?: React.ReactNode;
} & React.HTMLProps;

export function ActionsArea({
  onDelete,
  onTempDelete,
  children,
  className,
  ...rest
}: ActionsAreaProps) {
  const { form } = useFilesEditorContext();
  const { nodes } = useNode();

  const [hover, setHover] = useState(false);
  const [deleteHover, setDeleteHover] = useState(false);
  const [deleteTempHover, setDeleteTempHover] = useState(false);
  const deleted = useMemo(() => {
    const value = form.getValues(nodes?.[0]!!);
    if (value) {
      return isFormDeletableValue(value) && value._deleted;
    }
    return false;
  }, [form.formState, nodes]);
  const tempDeleted = useMemo(
    () =>
      isFormDeletableValue(form.getValues(nodes?.[0]!!)) &&
      form.getValues(nodes?.[0]!!)._temp,
    [form.formState, nodes],
  );

  function handleDelete() {
    nodes!!.forEach((node) => {
      form.setValue(
        node,
        setFormDeleteValue(getFormValue(form.getValues(node))),
      );
    });
    onDelete?.(nodes!!);
  }

  function handleTempDelete() {
    if (tempDeleted) {
      nodes?.forEach((node) => {
        form.setValue(node, getFormValue(form.getValues(node)));
      });
    } else {
      nodes?.forEach((node) => {
        form.setValue(
          node,
          setFormDeleteValue(getFormValue(form.getValues(node)), true, true),
        );
      });
      onTempDelete?.(nodes!!);
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-visible rounded-lg transition-colors data-[delete-hover=true]:bg-red-300/60 data-[delete-temp-hover=true]:bg-green-300/60 data-[deleted=true]:bg-red-300/60 data-[temp-deleted=true]:bg-green-300/60",
        className,
      )}
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-deleted={deleted}
      data-temp-deleted={tempDeleted}
      data-hover={hover}
      data-delete-hover={deleteHover}
      data-delete-temp-hover={deleteTempHover}
    >
      {children}
      <div className="animate-in fade-in absolute right-2 top-2 hidden gap-2 group-hover:flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleTempDelete}
              size="sm"
              variant="outline"
              className="size-6 px-0.5 py-0.5"
              onMouseEnter={() => setDeleteTempHover(true)}
              onMouseLeave={() => setDeleteTempHover(false)}
            >
              {tempDeleted ? (
                <Code className="size-4" />
              ) : (
                <CodeXml className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Temp Delete</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDelete}
              size="sm"
              variant="destructive"
              className="size-6 px-0.5 py-0.5"
              onMouseEnter={() => setDeleteHover(true)}
              onMouseLeave={() => setDeleteHover(false)}
            >
              <TrashIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
