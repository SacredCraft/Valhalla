import { Template } from "./template";

export type Resource = {
  name: string;
  originName?: string;
  description?: string;
  version?: string;

  templates: Template[];
  options?: {
    [key: string]: any;
  };
};

export type ResourceOptions = {
  extend?: Partial<Resource>;
  alias?: string;
  templatesOptions?: {
    [name: string]: {
      extend?: Partial<Template>;
      alias?: string;
      options?: Template;
      disable?: boolean;
    };
  };
} & Resource["options"];

export const createResource = (
  resource: Partial<Resource>,
): ((options?: ResourceOptions) => Resource) => {
  return (options?: ResourceOptions) => {
    // Filter out disabled templates
    const templates = (resource?.templates ? resource.templates : [])
      .map((template: Partial<Template>) => {
        const templateOptions = options?.templatesOptions?.[template.name!!];
        if (templateOptions?.disable) {
          return null;
        }
        return {
          name: template.name,
          matchedPaths: [],
          priority: 0,
          actions: [],
          ...template,
          ...templateOptions?.extend,
          ...(templateOptions?.alias
            ? { name: templateOptions.alias, originName: template.name }
            : {}),
        };
      })
      .filter(Boolean)
      .map((template) => template as Template)
      .sort((a, b) => b.priority - a.priority);
    return {
      name: "default",
      templates,
      ...options?.extend,
      ...resource,
      ...(options?.options ? { options: options.options } : {}),
      ...(options?.alias
        ? { name: options.alias, originName: resource.name }
        : {}),
    };
  };
};
