"use client";

import { useState } from "react";

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

type BlockProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  defaultCollapsed?: boolean;
};

export function Block({
  title,
  description,
  children,
  defaultCollapsed = true,
}: BlockProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [opened, setOpened] = useState(false);

  function toggle() {
    setCollapsed(!collapsed);
  }

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
        <Card className="h-fit">
          <CardContent className="p-0 grid space-y-4 py-0 pb-4 text-sm px-3">
            <AccordionTrigger className="pb-0" icon>
              <div className="flex flex-col items-start space-y-1.5 text-start">
                {title && <CardTitle>{title}</CardTitle>}
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-1 -mx-1 pb-0" asChild>
              {children}
            </AccordionContent>
            {collapsed && !opened && <div className="hidden">{children}</div>}
          </CardContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}
