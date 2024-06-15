"use client";

import { MutableRefObject, useState } from "react";

import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type GroupAreaProps = {
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

export function GroupArea({
  title,
  description,
  children,
  classNames,
  defaultCollapsed = true,
  model,
  icon = true,
  onValueChange,
  collapsed: propsCollapsed,
}: GroupAreaProps) {
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
          <Card className={cn("h-fit", classNames?.card)}>
            <CardContent
              className={cn("p-0 grid py-0 text-sm", classNames?.cardContent)}
            >
              <AccordionTrigger
                classNames={{
                  trigger: classNames?.trigger,
                }}
                icon={icon}
              >
                {(title || description) && (
                  <div className="flex flex-col items-start space-y-1.5 text-start">
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && (
                      <CardDescription>{description}</CardDescription>
                    )}
                  </div>
                )}
              </AccordionTrigger>
              <AccordionContent className={cn("px-3", classNames?.content)}>
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
