"use client";

import Link from "next/link";
import React, { Fragment } from "react";

import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/_components/ui/breadcrumb";

export function BrowserHeader() {
  const { resource } = useResourceContext();
  const { relativePath } = useBrowserContext();

  return (
    <header className="h-12 border-b flex px-2 items-center">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/resources/${resource.name}`}>{resource.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/resources/${resource.name}/browser`}>Browser</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {relativePath ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/resources/${resource.name}/browser/explore`}>
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
                            href={`/resources/${resource.name}/browser/explore/${[
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
