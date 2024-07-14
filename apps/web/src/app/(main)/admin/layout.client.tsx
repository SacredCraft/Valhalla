"use client";

import { motion } from "framer-motion";

import { useAside } from "@/app/(main)/_components/aside";
import { AdminMenu } from "@/app/(main)/admin/_components/admin-menu";

export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useAside();
  return (
    <div className="flex w-full h-full overflow-hidden">
      <AdminMenu />
      <motion.div
        className="flex-1 ml-[calc(var(--aside-width)+220px)]"
        layout
        layoutDependency={collapsed}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
