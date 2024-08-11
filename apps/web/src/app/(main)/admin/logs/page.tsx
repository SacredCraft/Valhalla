"use client";

import { api } from "@/trpc/react";

import { LogsTable } from "./_components/logs-table";
import { useLogsContext } from "./layout.client";

export default function Page() {
  const { page, orderBy, perPage } = useLogsContext();

  const { data } = api.logs.query.useQuery({
    page,
    orderBy,
    perPage,
  });

  return (
    <div className="my-2">
      <LogsTable logs={data?.logs ?? []} count={data?.count ?? 0} />
    </div>
  );
}
