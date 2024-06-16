"use client";

import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useEditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { isFormDeletableValue } from "@/lib/form";
import { cn } from "@/lib/utils";

import { GroupArea } from "@/components/form/areas/group-area";
import { Node, useNode } from "@/components/form/node";

type ContextProps = {
  items: ListItem[];
};

const ListAreaContext = createContext<ContextProps>({
  items: [],
});

export const useListArea = () => useContext(ListAreaContext);

type ListAreaProps = {
  draggable?: boolean;
  classNames?: {
    group?: string;
    item?: string;
  };
  itemKeys?: {
    id?: string[];
    label?: string[];
    description?: string[];
  };
  children?: (props: { item: ListItem }) => React.ReactNode;
  actions?: (props: {}) => React.ReactNode;
  footer?: (props: {}) => React.ReactNode;
};

export type ListItem = {
  text: string;
  checked: boolean;
  id: number;
  description: string;
  value?: any;
};

export function ListArea({
  draggable,
  classNames,
  children,
  footer,
  itemKeys,
}: ListAreaProps) {
  const { form } = useEditorContext();
  const { node } = useNode();

  const originalItems = useMemo(
    () => (form?.getValues(node!!) ?? []) as unknown as any[],
    [form?.formState, node],
  );

  const getValue = (obj: any, keys: string[]) => {
    for (const key of keys) {
      if (obj[key] !== undefined) {
        return obj[key];
      }
    }
  };

  const [items, setItems] = useState<ListItem[]>(
    originalItems.map((value, index) => {
      return {
        text: getValue(value, itemKeys?.label ?? ["label"]) as string,
        checked: false,
        id: index,
        description: getValue(
          value,
          itemKeys?.description ?? ["description"],
        ) as string,
        value,
      };
    }),
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => (isFormDeletableValue(item) ? item._temp : true)),
    [items],
  );

  useEffect(() => {
    const values = items.map((item, index) => item.value);
    form?.setValue(node!!, values);
  }, [form, items, node]);

  const [collapsedItems, setCollapsedItems] = useState<boolean[]>([]);

  const getCollapsed = useCallback(
    (index: number) => {
      return collapsedItems[index] ?? true;
    },
    [collapsedItems],
  );

  return (
    <ListAreaContext.Provider value={{ items }}>
      <div className="space-y-4">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          style={{ listStyle: "none", padding: 0 }}
          className={cn("space-y-2", classNames?.group)}
        >
          {filteredItems.map((item) => {
            const isTemp = isFormDeletableValue(item) ? item._temp : false;
            return (
              <Reorder.Item
                draggable={!!(draggable && getCollapsed(item.id))}
                drag={draggable && getCollapsed(item.id) ? "y" : false}
                key={item.id}
                value={item}
                whileDrag={{ scale: 0.9, opacity: 0.8 }}
              >
                <Node node={String(item.id)}>
                  <GroupArea
                    title={item.text}
                    collapsed={getCollapsed(item.id)}
                    onValueChange={(collapsed) => {
                      setCollapsedItems((prev) => {
                        const next = [...prev];
                        next[item.id] = collapsed;
                        return next;
                      });
                    }}
                    classNames={{
                      trigger: cn(
                        "group",
                        draggable && getCollapsed(item.id)
                          ? "cursor-grab"
                          : undefined,
                      ),
                      card: cn(
                        "w-full h-full",
                        isTemp ? "bg-green-300/60" : undefined,
                      ),
                    }}
                    icon={
                      <GripVertical
                        className={cn(
                          "size-4 invisible animate-in fade-in",
                          draggable && getCollapsed(item.id)
                            ? "group-hover:visible"
                            : undefined,
                        )}
                      />
                    }
                  >
                    {children && children({ item })}
                  </GroupArea>
                </Node>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
        {footer && footer({ items })}
      </div>
    </ListAreaContext.Provider>
  );
}
