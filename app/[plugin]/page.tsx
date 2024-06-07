"use client";

import { useAtomValue } from "jotai";
import { ChevronLeft, ListFilter, PlusCircle } from "lucide-react";
import { useState } from "react";

import { getPlugin } from "@/config/plugins";
import { tableAtom } from "@/lib/state";
import { ReloadIcon } from "@radix-ui/react-icons";

import { DataTable } from "@/components/plugin/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  params: {
    plugin: string;
  };
};

export default function Plugin({ params: { plugin: pluginId } }: Props) {
  const plugin = getPlugin(pluginId);

  const [tabValue, setTabValue] = useState(plugin?.dirs[0].id);
  const tableState = useAtomValue(tableAtom);

  if (plugin) {
    return (
      <Tabs
        value={tabValue}
        onValueChange={(value) => {
          setTabValue(value);
          if (tableState) {
            tableState.table.options?.meta?.refreshData();
          }
        }}
      >
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <TabsList>
              {plugin.dirs.map((dir) => (
                <TabsTrigger key={dir.id} value={dir.id}>
                  {dir.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {!tableState?.isRoot && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1"
                onClick={() => tableState?.table?.options?.meta?.goBack()}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Back
                </span>
              </Button>
            )}

            {tableState && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1"
                  onClick={() => tableState.table?.options?.meta?.refreshData()}
                >
                  <ReloadIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Reload
                  </span>
                </Button>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Config
              </span>
            </Button>
          </div>
        </div>
        {plugin.dirs.map((dir) => (
          <DataTable
            key={dir.id}
            pluginId={pluginId}
            dir={dir}
            current={tabValue === dir.id}
          />
        ))}
      </Tabs>
    );
  }

  return <div>Plugin not found</div>;
}
