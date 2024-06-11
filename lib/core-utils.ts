import {
  forOwn,
  isArray,
  isEmpty,
  isObject,
  mergeWith,
  omitBy,
  sortedIndexBy,
} from "lodash";

import { isFormDeletableValue } from "@/lib/form";
import { fromJson, fromString } from "@/lib/yaml";

function splitObject(
  obj: any,
  predicate: (value: any, key: string) => boolean,
): { matched: any; notMatched: any } {
  const matched: any = Array.isArray(obj) ? [] : {};
  const notMatched: any = Array.isArray(obj) ? [] : {};

  forOwn(obj, (value, key) => {
    if (isObject(value) && !Array.isArray(value) && predicate(value, key)) {
      if (Array.isArray(matched)) {
        matched.push(value);
      } else {
        matched[key] = value;
      }
    } else if (isObject(value) && !Array.isArray(value)) {
      const { matched: nestedMatched, notMatched: nestedNotMatched } =
        splitObject(value, predicate);

      if (!isEmpty(nestedMatched)) {
        if (Array.isArray(matched)) {
          matched.push(nestedMatched);
        } else {
          matched[key] = nestedMatched;
        }
      }
      if (!isEmpty(nestedNotMatched)) {
        if (Array.isArray(notMatched)) {
          notMatched.push(nestedNotMatched);
        } else {
          notMatched[key] = nestedNotMatched;
        }
      }
    } else if (Array.isArray(value)) {
      const { matched: nestedMatched, notMatched: nestedNotMatched } =
        splitObject(value, predicate);
      matched[key] = nestedMatched;
      notMatched[key] = nestedNotMatched;
    } else {
      if (Array.isArray(notMatched)) {
        notMatched.push(value);
      } else {
        notMatched[key] = value;
      }
    }
  });

  if (Array.isArray(matched)) {
    // Remove empty arrays from matched
    return { matched: matched.filter((v) => !isEmpty(v)), notMatched };
  } else {
    // Remove empty objects from matched
    return { matched: omitBy(matched, isEmpty), notMatched };
  }
}

export function toResult(fileName: string, contentToConvert: any) {
  const predicate = (value: any) => isFormDeletableValue(value);

  const { matched: cache, notMatched: content } = splitObject(
    contentToConvert,
    predicate,
  );

  return {
    cache,
    content,
    raw: convertJsonToConfiguration(fileName, content),
    res: JSON.stringify(mergeObjects(content, cache)),
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
      return fromString(content).toJSON();
    default:
      return {};
  }
}

function mergeArrays(array1: any[], array2: any[], key: string): any[] {
  const result = [...array2];
  const insertIndex = sortedIndexBy(array2, { [key]: 1 }, key);
  result.splice(insertIndex, 0, ...array1);
  return result;
}

export function mergeObjects(obj1: any, obj2: any): any {
  if (isArray(obj1) && isArray(obj2)) {
    return mergeArrays(obj1, obj2, "_index");
  } else if (isObject(obj1) && isObject(obj2)) {
    return mergeWith({}, obj1, obj2, (value1: any, value2: any) => {
      if (isArray(value1) && isArray(value2)) {
        return mergeArrays(value1, value2, "_index");
      }
    });
  } else {
    return obj1 || obj2;
  }
}
