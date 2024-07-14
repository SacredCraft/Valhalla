import { globalTemplates } from "@//server/config/global";
import { plugins } from "@//server/config/plugins";
import { PluginFile, Template } from "@//server/config/types";

export function getPlugin(id: string) {
  return plugins.find((plugin) => plugin.id === id);
}

export function findFileAttributes(
  files: PluginFile[],
  relativePath: string[],
  filename: string,
  parentTemplates?: Template[],
  parentActions?: React.ReactNode,
): { template?: Template; actions?: React.ReactNode } {
  const currentName = relativePath[0];
  const restPath = relativePath.slice(1);

  for (const file of files) {
    if (file.name === currentName) {
      const currentTemplates = file.templates ?? parentTemplates;
      const currentActions = file.actions ?? parentActions;

      if (restPath.length === 0) {
        // Find a matching template
        const template = currentTemplates?.find((tpl) =>
          new RegExp(tpl.regex).test(filename),
        );
        return { template, actions: currentActions };
      }

      if (file.type === "dir" && file.files) {
        return findFileAttributes(
          file.files,
          restPath,
          filename,
          currentTemplates,
          currentActions,
        );
      }
    }
  }

  // If file is not found, return the parent directory's attributes
  let template = parentTemplates?.find((tpl) =>
    new RegExp(tpl.regex).test(filename),
  );
  if (template) {
    return { template, actions: parentActions };
  }

  template = globalTemplates?.find((tpl) =>
    new RegExp(tpl.regex).test(filename),
  );
  return { template, actions: parentActions };
}
