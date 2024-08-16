"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";

import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@sacred-craft/valhalla-components";
import { useResourceFileContext } from "@sacred-craft/valhalla-resource-components";

export function FilesHeader() {
  const { resource } = useResourceContext();
  const { relativePath } = useResourceFileContext();
  const pathname = usePathname();

  const currentPageName = pathname.split("/")[4];

  return (
    <header className="h-12 border-b flex px-2 items-center">
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
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/resources/${resource.name}/files`}>Files</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {currentPageName && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  className="capitalize"
                  href={`/resources/${resource.name}/files/${currentPageName}/${relativePath.join("/")}`}
                >
                  {decodeURIComponent(currentPageName)}
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
                        href={`/resources/${resource.name}/files/${currentPageName}/${[
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
    </header>
  );
}
