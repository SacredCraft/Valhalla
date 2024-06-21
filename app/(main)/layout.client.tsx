"use client";

import { useAtom } from "jotai/index";
import { atomWithStorage } from "jotai/utils";

import { motion } from "framer-motion";
import React from "react";

import { Aside, AsideContext } from "@/components/layout/aside";

type ContentProps = React.PropsWithChildren<{}>;

const collapsedAtom = atomWithStorage<boolean>("aside-collapsed", false);

export function MainClientLayout({ children }: ContentProps) {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom);

  return (
    <AsideContext.Provider value={{ collapsed, setCollapsed }}>
      <Aside />
      {collapsed !== undefined && (
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
      )}
    </AsideContext.Provider>
  );
}
