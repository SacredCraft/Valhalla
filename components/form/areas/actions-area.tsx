"use client";

import { Code, CodeXml, TrashIcon } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import {
  getFormValue,
  isFormDeletableValue,
  setFormDeleteValue,
} from "@/lib/form";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionsAreaProps = {
  nodes: string[];
  onDelete?: (nodes: string[]) => void;
  onTempDelete?: (nodes: string[]) => void;
  children?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export function ActionsArea({
  nodes,
  onDelete,
  onTempDelete,
  children,
  className,
  ...rest
}: ActionsAreaProps) {
  const { form } = useContext(EditorContext);

  const [hover, setHover] = useState(false);
  const [deleteHover, setDeleteHover] = useState(false);
  const [deleteTempHover, setDeleteTempHover] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const tempDeleted = useMemo(
    () =>
      isFormDeletableValue(form?.getValues(nodes[0])) &&
      form?.getValues(nodes[0])._temp,
    [form, nodes],
  );

  const watchFields = form?.watch(nodes);

  useEffect(() => {
    const subscription = form?.watch(() => {
      setDeleted(false);
    });
    return () => subscription?.unsubscribe();
  }, [watchFields, form]);

  function handleDelete() {
    nodes.forEach((node) => {
      form?.setValue(
        node,
        setFormDeleteValue(getFormValue(form?.getValues(node))),
      );
    });

    setDeleted(true);
    onDelete?.(nodes);
  }

  function handleTempDelete() {
    if (tempDeleted) {
      setDeleted(false);
      nodes.forEach((node) => {
        form?.setValue(node, getFormValue(form?.getValues(node)));
      });
    } else {
      nodes.forEach((node) => {
        form?.setValue(
          node,
          setFormDeleteValue(getFormValue(form?.getValues(node)), true, true),
        );
      });
      setDeleted(false);
      onTempDelete?.(nodes);
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
      <div className="absolute right-2 top-2 hidden gap-2 animate-in fade-in group-hover:flex">
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
