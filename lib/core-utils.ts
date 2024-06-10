import { clone, merge } from "lodash";

import { isFormDeletableValue } from "@/lib/form";
import { fromJson, fromString } from "@/lib/yaml";

export function toResult(fileName: string, contentToConvert: any) {
  const cache: any = {};
  const content = clone(contentToConvert);

  function deleteCache(path: string[]) {
    let current = cache;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        return;
      }
      current = current[path[i]];
    }

    if (isFormDeletableValue(current[path[path.length - 1]])) {
      delete current[path[path.length - 1]];
    }
  }

  traverse(content, (path, value) => {
    if (isFormDeletableValue(value) && value._deleted) {
      let current = content;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      delete current[path[path.length - 1]];

      current = cache;
      if (value._temp) {
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      } else {
        deleteCache(path);
      }
    } else {
      deleteCache(path);
    }
  });

  return {
    cache,
    content,
    raw: convertJsonToConfiguration(fileName, content),
    res: JSON.stringify(merge(content, cache)),
  };
}

export function convertJsonToConfiguration(
  fileName: string,
  content: any,
): string {
  switch (fileName.split(".").pop()) {
    case "json":
      return JSON.stringify(content, null, 2);
    case "yaml":
    case "yml":
      return fromJson(content).toString();
    default:
      return "";
  }
}

export function convertConfigurationToJson(
  fileName: string,
  content: string,
): any {
  switch (fileName.split(".").pop()) {
    case "json":
      return JSON.parse(content);
    case "yaml":
    case "yml":
      return fromString(content);
    default:
      return {};
  }
}

export function traverse(
  obj: any,
  cb: (path: string[], value: any) => void,
  path: string[] = [],
) {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      traverse(obj[key], cb, [...path, key]);
    }
    cb([...path, key], obj[key]);
  }
}
