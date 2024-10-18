import { DeleteByTime } from "./delete-by-time";
import { SelectedDelete } from "./selected-delete";

export function LogsToolbar({ refetch }: { refetch: () => void }) {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative -mx-2">
      <div className="flex items-center gap-2 w-full">
        <SelectedDelete refetch={refetch} />
        <DeleteByTime refetch={refetch} />
      </div>
    </div>
  );
}
