import { Resource } from "./resource";
import { Template } from "./template";

export type ValhallaConfig = {
  resources: Resource[];
  globalTemplates: Template[];
  dateOptions: Intl.DateTimeFormatOptions;
};

export const defineValhallaConfig = (
  config: Partial<ValhallaConfig>,
): ValhallaConfig => {
  return {
    resources: [],
    globalTemplates: [],
    dateOptions: {},
    ...config,
  };
};
