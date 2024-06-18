import _ from "lodash";

import { findFileAttributes } from "@/config/utils";
import { Cross2Icon } from "@radix-ui/react-icons";

import { useFilesTableContext } from "@/components/plugin/files/files-table";
import { FilesTableFacetedFilter } from "@/components/plugin/files/files-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FilesTableViewOptions } from "./files-table-view-options";

export function FilesTableToolbar() {
  const { table } = useFilesTableContext();

  const isFiltered = table.getState().columnFilters.length > 0;

  const templates = _.uniqBy(
    table.options.data.map((row) => {
      const plugin = table.options.meta?.getPlugin()!!;
      const path = table.options.meta?.getPath()!!;
      const attributes = findFileAttributes(
        plugin.files,
        [...path, row.name],
        row.name,
      );
      return {
        value: attributes?.template?.name ?? "None",
        label: attributes?.template?.name ?? "None",
      };
    }),
    "value",
  );

  const types = _.uniqBy(
    table.options.data.map((row) => {
      return {
        value: row.type,
        label: row.type === "dir" ? "Directory" : "File",
      };
    }),
    "value",
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter files..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <FilesTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={types}
          />
        )}
        {table.getColumn("template") && (
          <FilesTableFacetedFilter
            column={table.getColumn("template")}
            title="Templates"
            options={templates}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <FilesTableViewOptions table={table} />
    </div>
  );
}
