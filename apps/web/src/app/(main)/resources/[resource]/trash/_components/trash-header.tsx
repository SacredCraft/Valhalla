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

import { useResourceContext } from "../../files/[[...slug]]/layout.client";

export function TrashHeader() {
  const { resource } = useResourceContext();

  return (
    <header className="h-12 border-b flex px-2 items-center justify-between">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/resources/${resource.name}`} className="capitalize">
                {resource.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Trash</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
