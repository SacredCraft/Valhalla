import { type ObjectEncodingOptions, WriteFileOptions } from "fs";
import React from "react";

import { Resource } from "./resource";

export type FileMeta = {
  type: "file" | "dir";
  name: string;
  path: string[];
  size: number;
  createdAt: Date;
  updatedAt: Date;
  ext?: string;
  [key: string]: any;
};

export type Template = {
  name: string;
  originName?: string;
  matchedPaths: string[];
  priority: number;

  filesOptions?: {
    read?:
      | (ObjectEncodingOptions & {
          flag?: string | undefined;
        })
      // eslint-disable-next-line no-undef
      | BufferEncoding
      | null;

    write?: WriteFileOptions;
  };

  options?: Options;

  // eslint-disable-next-line no-unused-vars
  isMatch?: (resource: Resource) => boolean;
  relatedFiles?: () => RelatedFile[];
};

export type RelatedFile = {};

export type Preview = "preview-image";

export type Options = {
  browser?: {
    icon?: string;
    // eslint-disable-next-line no-unused-vars
    label?: (name: string) => string;
    onClick?: Preview | "open";
  };

  render?: {
    component: () => React.JSX.Element;
    value: string;
    label: string;
  }[];
};

export const createTemplate = (template: Partial<Template>): Template => {
  return {
    name: "default",
    matchedPaths: [],
    priority: 0,
    relatedFiles: () => [],
    isMatch: () => true,
    options: {},
    ...template,
  };
};
