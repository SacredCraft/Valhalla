"use client";

import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@sacred-craft/valhalla-components";

export function LogsHeader() {
  return (
    <header className="h-12 border-b flex px-2 items-center">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Admin Panel</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Logs</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
