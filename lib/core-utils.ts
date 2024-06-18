import _, { isObject } from "lodash";

import { isFormDeletableValue } from "@/lib/form";
import { fromJson, fromString } from "@/lib/yaml";

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
  strict: boolean = false,
): any {
  switch (fileName.split(".").pop()) {
    case "json":
      return JSON.parse(content);
    case "yaml":
    case "yml":
      return fromString(content).toJSON();
    default: {
      if (strict) {
        throw new Error(`Unsupported file extension: ${fileName}`);
      }
      return {};
    }
  }
}

export function mergeObjects(obj1: any, obj2: any): any {
  if (_.isArray(obj1) && _.isArray(obj2)) {
    return [...obj1, ...obj2];
  } else if (_.isObject(obj1) && _.isObject(obj2)) {
    const merged: { [key: string]: any } = _.cloneDeep(obj1); // Fixed line
    _.forOwn(obj2, (value, key) => {
      if (key in merged) {
        merged[key] = mergeObjects(merged[key], value);
      } else {
        merged[key] = value;
      }
    });
    return merged;
  } else {
    return obj2;
  }
}

export function getContent(obj: any): any {
  const content: any = {};

  function recurse(current: any, path: string[]): void {
    if (isFormDeletableValue(current)) {
      return;
    }
    if (_.isObject(current) && !_.isArray(current)) {
      // If the current value is an object (but not an array), iterate its properties
      _.forOwn(current, (value, key) => {
        recurse(value, [...path, key]);
      });
    } else if (_.isArray(current)) {
      // If the current value is an array, iterate its elements
      _.forEach(current, (value, index) => {
        recurse(value, [...path, index.toString()]);
      });
    } else {
      // If the current value is neither an object nor an array, process it directly
      _.set(content, path, current);
    }
  }

  recurse(obj, []);

  return cleanObject(content);
}

export function cleanObject(obj: any): any {
  if (_.isArray(obj)) {
    return obj.reduce((acc, item) => {
      const cleanedItem = cleanObject(item);
      if (cleanedItem !== undefined) {
        acc.push(cleanedItem);
      }
      return acc;
    }, [] as any[]);
  } else if (isObject(obj) && obj !== null) {
    return _.reduce(
      obj,
      (result, value, key) => {
        const cleanedValue = cleanObject(value);
        if (cleanedValue !== undefined) {
          result[key] = cleanedValue;
        }
        return result;
      },
      {} as any,
    );
  } else {
    return obj !== null ? obj : undefined;
  }
}
