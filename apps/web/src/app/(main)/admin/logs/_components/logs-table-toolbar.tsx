import { DataTableViewOptions, Input } from "@sacred-craft/valhalla-components";

import { useLogsContext } from "../layout.client";

export function LogsTableToolbar() {
  const { table } = useLogsContext();

  if (!table) {
    throw new Error("LogsTableToolbar must be used within a LogsProvider");
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter action..."
          value={(table.getColumn("action")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("action")?.setFilterValue(value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
