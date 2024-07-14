"use client";

import Link from "next/link";
import React, { Fragment } from "react";

import { useBrowserContext } from "@//app/(main)/plugins/[plugin]/browser/layout.client";
import { usePluginContext } from "@//app/(main)/plugins/[plugin]/layout.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@//components/ui/breadcrumb";

export function BrowserHeader() {
  const { plugin } = usePluginContext();
  const { relativePath } = useBrowserContext();

  return (
    <header className="flex h-12 items-center border-b px-2">
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
              <Link href={`/plugins/${plugin.id}/browser`}>Browser</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {relativePath ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/plugins/${plugin.id}/browser/explore`}>
                    Explore
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
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
                            href={`/plugins/${plugin.id}/browser/explore/${[
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
            </>
          ) : (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Trash</BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
