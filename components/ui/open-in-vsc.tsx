"use client";

import Link, { LinkProps } from "next/link";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { VscodeIconsFileTypeVscode2 } from "@/components/icons/vsc";

type Props = { path: string; className?: string } & Omit<
  React.PropsWithChildren<LinkProps>,
  "href"
>;

export function OpenInVSC({ path, className, children, ...rest }: Props) {
  const [timestamp, setTimestamp] = useState(Date.now());

  const handleClick = () => {
    setTimestamp(Date.now());
  };

  return (
    <Link
      suppressHydrationWarning
      href={`vscode://file/${path}?_=${timestamp}`}
      className={cn("flex size-full items-center justify-center", className)}
      onClick={handleClick}
      {...rest}
    >
      <VscodeIconsFileTypeVscode2 className="size-4" />
      {children}
    </Link>
  );
}
