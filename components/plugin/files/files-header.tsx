"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import React, { Fragment, useMemo } from "react";

import { useFilesContext } from "@/app/plugins/[plugin]/files/layout.client";
import { usePluginContext } from "@/app/plugins/[plugin]/layout.client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function FilesHeader() {
  const { plugin } = usePluginContext();
  const { relativePath } = useFilesContext();
  const pathname = usePathname();

  const isInfo = pathname.split("/")[4] === "info";
  const isEditor = pathname.split("/")[4] === "editor";

  const currentPage = useMemo(
    () => ({
      value: isInfo ? "info" : isEditor ? "editor" : null,
      label: isInfo ? "Info" : isEditor ? "Editor" : null,
    }),
    [isEditor, isInfo],
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
                  <BreadcrumbPage key={path}>
                    {decodeURIComponent(path)}
                  </BreadcrumbPage>
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
                        {decodeURIComponent(path)}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex-1 md:grow-0 flex gap-4"></div>
    </header>
  );
}
