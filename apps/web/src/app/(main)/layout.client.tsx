"use client";

import { motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Aside, AsideContext } from "@/app/(main)/_components/aside";
import { Role } from "@prisma/client";

type ContextType = {
  username: string;
  role: Role;
  bio: string | null;
  UserResourceRole: {
    id: number;
    userId: string;
    resourceRoleId: number;
  }[];
  id: string;
  avatar: string | null;
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

export function MainClientLayout({ children, ...rest }: MainClientProps) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("aside-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("aside-collapsed", collapsed.toString());
  }, [collapsed]);

  return (
    <ProfileContext.Provider value={{ ...rest }}>
      <SessionProvider>
        <AsideContext.Provider value={{ collapsed, setCollapsed }}>
          <Aside />
          {collapsed !== undefined && (
            <motion.main
              layout
              layoutDependency={collapsed}
              className="flex-1 grid items-start gap-4 sm:py-0 md:gap-8"
              style={
                {
                  "--aside-width": collapsed ? "3.5rem" : "13rem",
                } as React.CSSProperties
              }
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
