import { ResourcePathForm } from "@/app/(main)/admin/resource-path/_components/resource-path-form";
import { ResourcePathHeader } from "@/app/(main)/admin/resource-path/_components/resource-path-header";
import { api } from "@/trpc/server";

export default async function ResourcePath() {
  const resourcePaths = await api.resources.getResourcePaths();

  return (
    <>
      <ResourcePathHeader />
      <ResourcePathForm resourcePaths={resourcePaths} />
    </>
  );
}
