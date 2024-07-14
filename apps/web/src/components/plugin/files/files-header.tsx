"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useMemo } from "react";

import { useFilesContext } from "@//app/(main)/plugins/[plugin]/files/layout.client";
import { usePluginContext } from "@//app/(main)/plugins/[plugin]/layout.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@//components/ui/breadcrumb";

export function FilesHeader() {
  const { plugin } = usePluginContext();
  const { relativePath } = useFilesContext();
  const pathname = usePathname();

  const currentPageName = pathname.split("/")[4];

  const currentPage = useMemo(
    () => ({
      value: currentPageName,
      label: currentPageName.charAt(0).toUpperCase() + currentPageName.slice(1),
    }),
    [currentPageName],
  );

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
          {currentPage.value && currentPage.label && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/plugins/${plugin.id}/files/${currentPage.value}/${relativePath.join("/")}`}
                >
                  {currentPage.label}
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
                        href={`/plugins/${plugin.id}/files/${currentPage.value}/${[
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
