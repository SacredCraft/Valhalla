import { plugins } from "@/config/plugins";
import { PluginFile, Template } from "@/config/types";

export function getPlugin(id: string) {
  return plugins.find((plugin) => plugin.id === id);
}

export function findFileAttributes(
  files: PluginFile[],
  path: string[],
  parentTemplate?: Template,
  parentActions?: React.ReactNode,
): { template?: Template; actions?: React.ReactNode } {
  const currentName = path[0];
  const restPath = path.slice(1);

  for (const file of files) {
    if (file.name === currentName) {
      const currentTemplate = file.template ?? parentTemplate;
      const currentActions = file.actions ?? parentActions;

      if (restPath.length === 0) {
        return { template: currentTemplate, actions: currentActions };
      }

      if (file.type === "dir" && file.files) {
        return findFileAttributes(
          file.files,
          restPath,
          currentTemplate,
          currentActions,
        );
      }
    }
  }

  // If file is not found, return the parent directory's attributes
  return { template: parentTemplate, actions: parentActions };
}
