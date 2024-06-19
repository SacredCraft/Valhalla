"use client";

import { motion } from "framer-motion";
import React from "react";

import { useAside } from "@/components/layout/aside";

type ContentProps = React.PropsWithChildren<{}>;

export function RootClientLayout({ children }: ContentProps) {
  const { collapsed } = useAside();
  return (
    <motion.main
      layout
      layoutDependency={collapsed}
      className="flex-1 grid items-start gap-4 sm:py-0 md:gap-8"
      style={{
        marginLeft: collapsed ? "3.5rem" : "13rem",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.main>
  );
}
