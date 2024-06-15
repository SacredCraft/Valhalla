import _, { cloneDeep, isArray, isObject } from "lodash";

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
): any {
  switch (fileName.split(".").pop()) {
    case "json":
      return JSON.parse(content);
    case "yaml":
    case "yml":
      return fromString(content).toJSON();
    default:
      return {};
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
  function recurse(current: any, parent: any, path: string[]): void {
    if (isFormDeletableValue(current)) {
      return;
    }
    if (_.isObject(current) && !_.isArray(current)) {
      // If the current value is an object (but not an array), iterate its properties
      _.forOwn(current, (value, key) => {
        recurse(value, current, [...path, key]);
      });
    } else if (_.isArray(current)) {
      // If the current value is an array, iterate its elements
      _.forEach(current, (value, index) => {
        recurse(value, current, [...path, index.toString()]);
      });
    } else {
      // If the current value is neither an object nor an array, process it directly
      _.set(content, path, current);
    }
  }

  recurse(obj, null, []);

  return cleanObject(content);
}

function cleanObject(obj: any): any {
  if (_.isArray(obj)) {
    // 对于数组，递归清理每个元素
    return obj.reduce((acc, item) => {
      const cleanedItem = cleanObject(item);
      if (cleanedItem !== undefined) {
        acc.push(cleanedItem);
      }
      return acc;
    }, [] as any[]);
  } else if (isObject(obj) && obj !== null) {
    // 对于对象（包括非 PlainObject），递归清理每个键值对
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
    // 对于其他类型的值，返回非 null 的值
    return obj !== null ? obj : undefined;
  }
}
