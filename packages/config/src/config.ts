import { Resource, Template } from "@sacred-craft/valhalla-resource";

export type ValhallaConfig = {
  resources: Resource[];
  globalTemplates: Template[];
  dateOptions: Intl.DateTimeFormatOptions;
  enableComments: boolean;
  folders: {
    valhalla: string;
    trash: string;
    files: string;
    versions: string;
  };
};

export const defineValhallaConfig = (
  config: Partial<ValhallaConfig>,
): ValhallaConfig => {
  return {
    resources: [],
    globalTemplates: [],
    dateOptions: {},
    enableComments: true,
    folders: {
      valhalla: ".valhalla",
      trash: "trash",
      files: "files",
      versions: "versions",
      ...(config.folders || {}),
    },
    ...config,
  };
};
