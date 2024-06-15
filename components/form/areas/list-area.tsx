"use client";

import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { getFormValue, isFormDeletableValue } from "@/lib/form";
import { cn } from "@/lib/utils";

import { GroupArea } from "@/components/form/areas/group-area";

type ContextProps = {};

type ListAreaProps = {
  draggable?: boolean;
  classNames?: {
    group?: string;
    item?: string;
  };
  node: string;
  labelKey: (item: any) => string;
  children?: (props: {
    item: any;
    items: any[];
    index: number;
    labelKey: (item: any) => string;
  }) => React.ReactNode;
  footer?: (props: { items: any[] }) => React.ReactNode;
};

export function ListArea({
  draggable,
  classNames,
  node,
  children,
  footer,
  ...rest
}: ListAreaProps) {
  const { form } = useContext(EditorContext);
  const initialItems = (getFormValue(form?.getValues(node)) ??
    []) as unknown as any[];
  const [items, setItems] = useState(initialItems);

  const watchField = form?.watch(node);

  useEffect(() => {
    const subscription = form?.watch((values) => {
      setItems(form.getValues(node));
    });
    return () => subscription?.unsubscribe();
  }, [watchField, form, node]);

  const [collapsedItems, setCollapsedItems] = useState<boolean[]>([]);

  const getCollapsed = useCallback(
    (index: number) => {
      return collapsedItems[index] ?? true;
    },
    [collapsedItems],
  );

  return (
    <div className="space-y-4">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={(items) => form?.setValue(node, items)}
        style={{ listStyle: "none", padding: 0 }}
        className={cn("space-y-2", classNames?.group)}
      >
        {items
          .filter((item) => (isFormDeletableValue(item) ? item._temp : true))
          .map((item, index) => {
            const isTemp = isFormDeletableValue(item) ? item._temp : false;
            return (
              <Reorder.Item
                draggable={!!(draggable && getCollapsed(index))}
                drag={draggable && getCollapsed(index) ? "y" : false}
                key={rest.labelKey(getFormValue(item)) ?? Math.random()}
                value={item}
                whileDrag={{ scale: 0.9, opacity: 0.8 }}
              >
                <GroupArea
                  title={rest.labelKey(getFormValue(item))}
                  collapsed={getCollapsed(index)}
                  onValueChange={(collapsed) => {
                    setCollapsedItems((prev) => {
                      const next = [...prev];
                      next[index] = collapsed;
                      return next;
                    });
                  }}
                  classNames={{
                    trigger: cn(
                      "group",
                      draggable && getCollapsed(index)
                        ? "cursor-grab"
                        : undefined,
                    ),
                    card: cn(
                      "w-full h-full",
                      isTemp ? "bg-green-300/60" : undefined,
                    ),
                  }}
                  icon={
                    <GripVertical className="size-4 invisible group-hover:visible animate-in fade-in" />
                  }
                >
                  {children &&
                    children({ item, items, labelKey: rest.labelKey, index })}
                </GroupArea>
              </Reorder.Item>
            );
          })}
      </Reorder.Group>
      {footer && footer({ items })}
    </div>
  );
}
