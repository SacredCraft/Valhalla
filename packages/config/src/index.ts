import { Resource, Template } from "@sacred-craft/valhalla-resource";

export type ValhallaConfig = {
  limits: {
    // 允许被编辑的文件大小
    editableFileSize: number;
    // 允许上传的文件大小
    uploadFileSize: number;
  };
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
    limits: {
      editableFileSize: 1024 * 1024 * 10, // 10MB
      uploadFileSize: 1024 * 1024 * 10, // 10MB
    },
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
