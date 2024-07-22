import { useBrowserContext } from "@/app/(main)/resources/[resource]/browser/layout.client";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  DataTableViewOptions,
  Input,
} from "@sacred-craft/valhalla-components";

export function TrashTableToolbar() {
  const { trashTable } = useBrowserContext();

  if (!trashTable) {
    throw new Error("TrashTableToolbar must be used within a TrashTable");
  }

  const isFiltered = trashTable.getState().columnFilters.length > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter trash..."
          value={
            (trashTable.getColumn("name")?.getFilterValue() as string) ?? ""
          }
          onChange={(value) =>
            trashTable.getColumn("name")?.setFilterValue(value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => trashTable.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={trashTable} />
    </div>
  );
}
