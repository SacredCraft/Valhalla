import { useUsersContext } from "@//app/(main)/admin/users/layout.client";
import { Button } from "@//components/ui/button";
import { DataTableFacetedFilter } from "@//components/ui/data-table-faceted-filter";
import { DataTableViewOptions } from "@//components/ui/data-table-view-options";
import { Input } from "@//components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";

export function UsersTableToolbar() {
  const { table } = useUsersContext();

  if (!table) {
    throw new Error("UsersTableToolbar must be used within a UsersTable");
  }

  const isFiltered = table.getState().columnFilters.length > 0;

  const roles = [
    {
      label: "ADMIN",
      value: "ADMIN",
    },
    {
      label: "USER",
      value: "USER",
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(value) =>
            table.getColumn("username")?.setFilterValue(value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roles}
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
