import _ from "lodash";

import { useBrowserContext } from "@//app/(main)/plugins/[plugin]/browser/layout.client";
import { Button } from "@//components/ui/button";
import { DataTableFacetedFilter } from "@//components/ui/data-table-faceted-filter";
import { DataTableViewOptions } from "@//components/ui/data-table-view-options";
import { Input } from "@//components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";

export function FilesTableToolbar() {
  const { table } = useBrowserContext();

  if (!table) {
    throw new Error("FilesTableToolbar must be used within a FilesTable");
  }

  const isFiltered = table.getState().columnFilters.length > 0;

  const templates = _.uniqBy(
    table.options.data.map((row) => {
      const name = row.template?.name ?? "None";
      return {
        value: name,
        label: name,
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
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={types}
          />
        )}
        {table.getColumn("template") && (
          <DataTableFacetedFilter
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
