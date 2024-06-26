export type ValhallaPlugin = {
  id: string;
  name: string;
  files: PluginFile[];
};

export type Relations =
  | {
      enable: false;
    }
  | {
      enable: true;
      value: { type: "dir" | "file"; ids: string[] }[];
    };

export type PluginFile = {
  name: string;
  templates?: Template[];
  actions?: React.ReactNode;
  relations?: Relations;
} & (
  | {
      type: "dir";
      files: PluginFile[];
    }
  | {
      type: "file";
    }
);

export type Template = {
  name: string;
  value?: React.ElementType;
  regex: string;
};
