"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@//components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@//components/ui/card";
import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

type VisibleAreaProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onValueChange?: (value: boolean) => void;
  model?: boolean;
  icon?: boolean | React.ReactNode;
  classNames?: {
    trigger?: string;
    content?: string;
    cardContent?: string;
    card?: string;
  };
};

export function VisibleArea({
  title,
  description,
  children,
  classNames,
  defaultCollapsed = true,
  model,
  icon = true,
  onValueChange,
  collapsed: propsCollapsed,
}: VisibleAreaProps) {
  const [collapsed, setCollapsed] = useControllableState<boolean>({
    prop: propsCollapsed,
    defaultProp: defaultCollapsed,
    onChange: onValueChange,
  });
  const [opened, setOpened] = useState(false);

  function toggle() {
    setCollapsed(!collapsed);
  }

  if (!model) {
    return (
      <Accordion
        type="single"
        collapsible
        value={collapsed ? "" : "item"}
        onValueChange={(value) => {
          setOpened(value === "item");
          toggle();
        }}
      >
        <AccordionItem value="item" className="space-y-4" asChild>
          <Card
            className={cn(
              "h-fit bg-transparent rounded-lg my-2",
              classNames?.card,
            )}
          >
            <CardContent
              className={cn("p-2 grid py-1 text-sm", classNames?.cardContent)}
            >
              <AccordionTrigger
                classNames={{
                  trigger: classNames?.trigger,
                  header: "px-0",
                }}
                icon={icon}
              >
                {(title || description) && (
                  <div className="flex flex-col items-start space-y-1.5 text-start">
                    {title && <CardTitle className="px-0">{title}</CardTitle>}
                    {description && (
                      <CardDescription>{description}</CardDescription>
                    )}
                  </div>
                )}
              </AccordionTrigger>
              <AccordionContent
                className={cn("overflow-visible", classNames?.content)}
              >
                {children}
              </AccordionContent>
              {collapsed && !opened && <div className="hidden">{children}</div>}
            </CardContent>
          </Card>
        </AccordionItem>
      </Accordion>
    );
  }
}

export function RootVisibleArea({ classNames, ...props }: VisibleAreaProps) {
  return (
    <VisibleArea
      classNames={{
        card: cn("border-t-0 my-0 rounded-none border-x-0", classNames?.card),
        cardContent: cn("px-2", classNames?.cardContent),
      }}
      {...props}
    />
  );
}
