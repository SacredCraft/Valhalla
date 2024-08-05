import { db } from "@sacred-craft/valhalla-database";

import { LogsHeader } from "./_components/logs-header";
import { LogsTabs } from "./_components/logs-tabs";

export default async function Page() {
  const logs = await db.log.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      action: true,
      createdAt: true,
      operators: true,
    },
  });

  return (
    <>
      <LogsHeader />
      <LogsTabs />
    </>
  );
}
