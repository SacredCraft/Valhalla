"use client";

import { motion } from "framer-motion";
import { useAtom } from "jotai/index";
import { atomWithStorage } from "jotai/utils";
import { SessionProvider } from "next-auth/react";
import React, { PropsWithChildren, createContext, useContext } from "react";

import { Aside, AsideContext } from "@//components/layout/aside";
import { Role } from "@prisma/client";

type ContextType = {
  id: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  role: Role;
  UserResourceRole: { id: string; userId: string; resourceRoleId: string }[];
};

export const ProfileContext = createContext<ContextType | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

type MainClientProps = PropsWithChildren<ContextType>;

const collapsedAtom = atomWithStorage<boolean>("aside-collapsed", true);

export function MainClientLayout({ children, ...rest }: MainClientProps) {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom);

  return (
    <ProfileContext.Provider value={{ ...rest }}>
      <SessionProvider>
        <AsideContext.Provider value={{ collapsed, setCollapsed }}>
          <Aside />
          {collapsed !== undefined && (
            <motion.main
              layout
              layoutDependency={collapsed}
              className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8"
              style={{
                marginLeft: collapsed ? "3.5rem" : "13rem",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {children}
            </motion.main>
          )}
        </AsideContext.Provider>
      </SessionProvider>
    </ProfileContext.Provider>
  );
}
