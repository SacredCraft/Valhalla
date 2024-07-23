import { Resource } from "./resource";

export type Template = {
  name: string;
  originName?: string;
  matchedPaths: string[];
  priority: number;
  action?: Action;

  resource?: Resource;

  // eslint-disable-next-line no-unused-vars
  isMatch?: (resource: Resource) => boolean;
  relatedFiles?: () => RelatedFile[];
};

export type RelatedFile = {};

export type Action =
  | {
      render: {
        info?: () => React.ReactNode;
        editor?: () => React.ReactNode;
        raw?: () => React.ReactNode;
      };
    }
  | {
      redirect: string;
    }
  | {
      error: string;
    }
  | {
      preview: "image" | "video" | "audio";
    };

export const createTemplate = (template: Partial<Template>): Template => {
  return {
    name: "default",
    matchedPaths: [],
    priority: 0,
    relatedFiles: () => [],
    isMatch: () => true,
    ...template,
  };
};
