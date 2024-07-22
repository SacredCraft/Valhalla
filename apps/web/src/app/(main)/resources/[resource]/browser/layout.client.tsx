"use client";

import React, { Dispatch, createContext, useContext, useState } from "react";

type ContextType = {
  relativePath?: string[];
  setRelativePath: Dispatch<string[] | undefined>;
};

const BrowserContext = createContext<ContextType | undefined>(undefined);

export const useBrowserContext = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error("useBrowserContext must be used within a BrowserProvider");
  }
  return context;
};

type BrowserClientLayoutProps = {
  children?: React.ReactNode;
};

export function BrowserClientLayout({ children }: BrowserClientLayoutProps) {
  const [relativePath, setRelativePath] = useState<string[]>();

  return (
    <BrowserContext.Provider
      value={{
        relativePath,
        setRelativePath,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
}
