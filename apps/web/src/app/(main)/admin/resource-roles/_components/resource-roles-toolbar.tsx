import { ResourceRolesCreate } from "./resource-roles-create";

export function ResourceRolesToolbar() {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div>
        <ResourceRolesCreate />
      </div>
    </div>
  );
}
