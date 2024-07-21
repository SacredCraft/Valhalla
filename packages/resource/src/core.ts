import { Resource } from "./resource";
import { Template } from "./template";

export const getTemplateByPath = (
  path: string[],
  resource: Resource,
  config: { globalTemplates: Template[] },
): Template | null => {
  const templates = [...resource.templates, ...config.globalTemplates];
  let matchedTemplate: Template | null = null;
  for (const template of templates) {
    template.matchedPaths.forEach((matchedPath) => {
      if (matchedPath.includes("*")) {
        const regex = new RegExp(matchedPath.replace(/\*/g, ".*"));
        if (regex.test(path.join("/"))) {
          if (template.isMatch?.(resource)) {
            matchedTemplate = template;
          }
        }
      } else if (matchedPath === path.join("/")) {
        if (template.isMatch?.(resource)) {
          matchedTemplate = template;
        }
      }
    });
  }
  return matchedTemplate;
};
