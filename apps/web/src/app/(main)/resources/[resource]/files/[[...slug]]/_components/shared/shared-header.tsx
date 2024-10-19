"use client";

import Link from "next/link";
import React, { Fragment, ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@sacred-craft/valhalla-components";

import { useRelativePath, useResourceContext } from "../../layout.client";

export function SharedHeader({ headerActions }: { headerActions?: ReactNode }) {
  const { resource } = useResourceContext();
  const relativePath = useRelativePath();

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
          {relativePath ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/resources/${resource.name}/files`}>Files</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
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
                            href={`/resources/${resource.name}/files/${[
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
            </>
          ) : (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Files</BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">{headerActions}</div>
    </header>
  );
}
