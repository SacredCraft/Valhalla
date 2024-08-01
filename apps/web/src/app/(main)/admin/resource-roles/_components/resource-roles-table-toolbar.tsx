import { DataTableViewOptions, Input } from "@sacred-craft/valhalla-components";

import { useResourceRolesContext } from "../layout.client";

export function ResourceRolesTableToolbar() {
  const { table } = useResourceRolesContext();

  if (!table) {
    throw new Error(
      "ResourceRolesTableToolbar must be used within a ResourceRolesTable",
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter role..."
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("role")?.setFilterValue(value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
