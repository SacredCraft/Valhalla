import { motion } from "framer-motion";
import React from "react";

import { useAside } from "@//components/layout/aside";
import { Button, ButtonProps } from "@//components/ui/button";
import { cn } from "@/lib/utils";

type AnimatedItemProps = {
  icon?: React.ReactNode;
  className?: string;
} & ButtonProps;

export function AnimatedItem({
  icon,
  children,
  className,
  ...rest
}: AnimatedItemProps) {
  const { collapsed } = useAside();
  return (
    <Button
      variant="outline"
      className={cn(
        "text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center gap-2 rounded-lg p-0 transition-colors md:h-8",
        collapsed ? "md:w-8" : "w-full",
        className,
      )}
      asChild
      {...rest}
    >
      <motion.button
        layout
        style={{
          borderRadius: "12px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {icon && <motion.span layout="position">{icon}</motion.span>}
        {children && (
          <motion.span
            className={collapsed ? "hidden" : "inline"}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.span>
        )}
        <span className="sr-only">{children}</span>
      </motion.button>
    </Button>
  );
}
