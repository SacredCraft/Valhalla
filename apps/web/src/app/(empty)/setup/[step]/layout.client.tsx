"use client";

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
          "text-foreground absolute inset-0 items-center justify-center",
          step > 0 ? "dark bg-zinc-900" : undefined,
        )}
        layoutId="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {step > 0 && (
            <div className="absolute -top-1/2 left-1/2 w-64 -translate-x-1/2">
              <motion.nav
                className="z-10"
                layoutId="nav"
                transition={{ duration: 0.5 }}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center justify-between rounded-full bg-zinc-800 p-4">
                  <motion.div
                    layoutId="step-1"
                    className={cn(
                      "h-8 w-8 rounded-full",
                      step === 1 ? "bg-primary" : "bg-zinc-700",
                    )}
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: { delay: 0.1 },
                    }}
                  />
                  <motion.h1
                    layoutId="title"
                    className="mx-2 text-lg font-semibold"
                  >
                    {name}
                  </motion.h1>
                  <motion.div
                    layoutId="step-2"
                    className={cn(
                      "h-8 w-8 rounded-full",
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
