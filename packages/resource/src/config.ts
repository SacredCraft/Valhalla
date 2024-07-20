import { Resource } from "./resource";
import { Template } from "./template";

export type ValhallaConfig = {
  resources: Resource[];
  globalTemplates: Template[];
};

export const defineValhallaConfig = (
  config: Partial<ValhallaConfig>,
): ValhallaConfig => {
  return {
    resources: [],
    globalTemplates: [],
    ...config,
  };
};
