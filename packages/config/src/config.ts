import { Resource, Template } from "@sacred-craft/valhalla-resource";

export type ValhallaConfig = {
  resources: Resource[];
  globalTemplates: Template[];
  dateOptions: Intl.DateTimeFormatOptions;
  folders: {
    valhalla: string;
    trash: string;
    files: string;
  };
};

export const defineValhallaConfig = (
  config: Partial<ValhallaConfig>,
): ValhallaConfig => {
  return {
    resources: [],
    globalTemplates: [],
    dateOptions: {},
    folders: {
      valhalla: ".valhalla",
      trash: "trash",
      files: "files",
      ...(config.folders || {}),
    },
    ...config,
  };
};
