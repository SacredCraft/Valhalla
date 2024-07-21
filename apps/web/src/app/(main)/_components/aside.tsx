"use client";

import { motion } from "framer-motion";
import {
  Blocks,
  Moon,
  PanelRight,
  ShieldHalf,
  Sun,
  SunMoon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AnimatedItem } from "@/app/(main)/_components/animated-item";
import { Profile } from "@/app/(main)/_components/profile";
import { useProfile } from "@/app/(main)/layout.client";
import valhallaConfig from "@/valhalla";
import { cn } from "@sacred-craft/valhalla-components";

type ContextType = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const AsideContext = createContext<ContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useAside = () => {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error("useAside must be used within an AsideProvider");
  }
  return context;
};

export function Aside() {
  const { collapsed, setCollapsed } = useAside();
  const { role } = useProfile();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.aside
      layout="size"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed md:h-dvh border-e inset-y-0 left-0 z-10 hidden flex-col bg-background sm:flex",
        collapsed ? "w-14" : "w-52",
      )}
    >
      <motion.nav
        layout="position"
        className="flex flex-col items-center gap-2 px-2 py-4"
      >
        <Link
          href="#"
          className={cn(
            "group flex shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base mb-2 ",
            !collapsed ? "w-32" : undefined,
          )}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={collapsed ? "w-8" : "w-20"}
          >
            <Image
              src="/pure-icon.png"
              alt="Valhalla"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto text-center font-mono tracking-widest transition-all hover:scale-110 dark:invert"
              priority
            />
            <span className="sr-only">Valhalla</span>
          </motion.div>
        </Link>

        <Item value="resources" label="Resources" Icon={Blocks} />

        {role === "ADMIN" && (
          <Item value="admin" label="Admin Panel" Icon={ShieldHalf} />
        )}
      </motion.nav>
      <motion.nav
        layout="position"
        className={cn("mt-auto flex flex-col items-center gap-2 px-2 py-4")}
      >
        <Profile />
        <div
          className={cn(
            "flex w-full items-center gap-2",
            collapsed && "flex-col",
          )}
        >
          <AnimatedItem
            onClick={() =>
              setTheme(
                theme === "light"
                  ? "dark"
                  : theme === "dark"
                    ? "system"
                    : "light",
              )
            }
            icon={
              mounted ? (
                theme === "dark" ? (
                  <Moon className="size-5" />
                ) : theme === "light" ? (
                  <Sun className="size-5" />
                ) : (
                  <SunMoon className="size-5" />
                )
              ) : (
                <SunMoon className="size-5" />
              )
            }
          >
            {mounted && <span className="capitalize">{theme}</span>}
          </AnimatedItem>
          <AnimatedItem
            className="h-9 w-9"
            icon={<PanelRight className="size-5" />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      </motion.nav>
    </motion.aside>
  );
}

function Item({
  value,
  label,
  Icon,
}: {
  value: string;
  label: string;
  Icon?: React.ElementType;
}) {
  const pathname = usePathname();
  const pathnameSplit = useMemo(() => pathname.split("/").slice(1), [pathname]);
  const route = useMemo(() => pathnameSplit[0], [pathnameSplit]);
  const href = useMemo(
    () =>
      value === "resources"
        ? `/resources/${valhallaConfig.resources[0]?.name}`
        : `/${value}`,
    [value],
  );
  const { collapsed } = useAside();
  return (
    <Link
      href={href}
      className={cn("w-full", collapsed ? "h-9 w-9" : undefined)}
    >
      <AnimatedItem
        size="sm"
        variant={route === value ? "secondary" : "ghost"}
        className={cn(
          "gap-2 w-full text-primary",
          collapsed ? undefined : "justify-start px-3",
        )}
        icon={Icon && <Icon className={cn(collapsed ? "size-5" : "size-4")} />}
      >
        {!collapsed && label}
      </AnimatedItem>
    </Link>
  );
}
