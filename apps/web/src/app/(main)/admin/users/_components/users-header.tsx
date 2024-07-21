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

export const UsersHeader = () => {
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
          <BreadcrumbPage>Users</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
