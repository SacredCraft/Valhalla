import { api } from "@/trpc/server";

import { ResourceRolesTable } from "./_components/resource-roles-table";

export default async function ResourceRolesPage() {
  const resourceRoles = (await api.resources.getResourceRoles()).map(
    (role) => ({
      ...role,
      users: role.UserResourceRole.map((urr) => urr.user),
      UserResourceRole: undefined,
    }),
  );

  return (
    <div className="my-2">
      <ResourceRolesTable resourceRoles={resourceRoles} />
    </div>
  );
}
