"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, PanelLeft, Search, Settings } from "lucide-react";
import React, { Fragment } from "react";

import { plugins } from "@/config/plugins";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const pages = usePathname().split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <span className="text-center font-mono tracking-widest transition-all group-hover:scale-110">
                V
              </span>
              <span className="sr-only">Valhalla</span>
            </Link>
            {plugins.map((plugin) => (
              <Link
                key={plugin.id}
                href={`/${plugin.id}`}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <plugin.icon className="h-5 w-5" />
                {plugin.name}
              </Link>
            ))}
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Valhalla</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {pages.map((page, index) =>
            index === pages.length - 1 ? (
              <BreadcrumbPage key={page} className="capitalize">
                {page}
              </BreadcrumbPage>
            ) : (
              <Fragment key={page}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/${pages.slice(0, index + 1).join("/")}`}
                      className="capitalize"
                    >
                      {page}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ),
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
    </header>
  );
}
