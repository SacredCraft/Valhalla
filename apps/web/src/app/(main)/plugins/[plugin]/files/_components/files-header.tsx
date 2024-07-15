"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useMemo } from "react";

import { useFilesContext } from "@/app/(main)/plugins/[plugin]/files/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/_components/ui/breadcrumb";

export function FilesHeader() {
  const { plugin } = usePluginContext();
  const { relativePath } = useFilesContext();
  const pathname = usePathname();

  const currentPageName = pathname.split("/")[4];

  return (
    <header className="h-12 border-b flex px-2 items-center">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/plugins/${plugin.id}`}>{plugin.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/plugins/${plugin.id}/files`}>Files</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {currentPageName && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  className="capitalize"
                  href={`/plugins/${plugin.id}/files/${currentPageName}/${relativePath.join("/")}`}
                >
                  {currentPageName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          {relativePath.map((path, index) => (
            <Fragment key={path}>
              {index === relativePath.length - 1 ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage key={path}>{path}</BreadcrumbPage>
                </>
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href={`/plugins/${plugin.id}/files/${currentPageName}/${[
                          ...relativePath.slice(0, index + 1),
                        ].join("/")}`}
                      >
                        {path}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
