import { Button } from "@sacred-craft/valhalla-components";
import { db } from "@sacred-craft/valhalla-database";

export function LogsTabs() {
  const clearLogs = async () => {
    "use server";
    await db.log.deleteMany();
  };

  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div className="flex gap-2">
        <form action={clearLogs}>
          <Button
            type="submit"
            size="sm"
            variant="default"
            className="w-full justify-start h-7"
          >
            Clear
          </Button>
        </form>
      </div>
    </div>
  );
}
