"use client";

import theme from "tailwindcss/defaultTheme";

import { motion } from "framer-motion";
import { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";

type ContextType = {
  step: number;
  name: string;
  setName: (name: string) => void;
};

export const SetupContext = createContext<ContextType | null>(null);

export const useSetupContext = () => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetupContext must be used within a SetupProvider");
  }
  return context;
};

export function SetupClientLayout({
  children,
  step,
}: {
  children: React.ReactNode;
  step: number;
}) {
  const [name, setName] = useState("");

  return (
    <SetupContext.Provider value={{ step, name, setName }}>
      <motion.main
        className={cn(
          "absolute inset-0 items-center justify-center text-foreground",
          step > 0 ? "dark bg-zinc-900" : undefined,
        )}
        layoutId="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {step > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-1/2 w-64">
              <motion.nav
                className="z-10"
                layoutId="nav"
                transition={{ duration: 0.5 }}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center justify-between p-4 rounded-full bg-zinc-800">
                  <motion.div
                    layoutId="step-1"
                    className={cn(
                      "w-8 h-8 rounded-full",
                      step === 1 ? "bg-primary" : "bg-zinc-700",
                    )}
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: { delay: 0.1 },
                    }}
                  />
                  <motion.h1
                    layoutId="title"
                    className="text-lg font-semibold mx-2"
                  >
                    {name}
                  </motion.h1>
                  <motion.div
                    layoutId="step-2"
                    className={cn(
                      "w-8 h-8 rounded-full",
                      step === 2 ? "bg-primary" : "bg-zinc-700",
                    )}
                    animate={{ scale: [1, 1.2, 1] }}
                  />
                </div>
              </motion.nav>
            </div>
          )}
          {children}
        </div>
      </motion.main>
    </SetupContext.Provider>
  );
}
