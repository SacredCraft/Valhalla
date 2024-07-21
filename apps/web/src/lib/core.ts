"use server";

import fs from "fs";
import path from "path";

import {
  cleanObject,
  convertConfigurationToJson,
  convertJsonToConfiguration,
} from "@/lib/core-utils";
import { api } from "@/trpc/server";

function getValhallaDir(filePath: string[]) {
  return [...filePath, ".valhalla"].join(path.sep);
}

function createValhallaDir(filePath: string[]) {
  fs.mkdirSync(getValhallaDir(filePath));
}

function getValhallaFileContent(filePath: string[]) {
  const fileName = filePath[filePath.length - 1]!!;
  const folder = filePath.slice(0, -1);
  if (!fs.existsSync(getValhallaDir(folder))) {
    return null;
  }
  return fs.readFileSync(path.join(getValhallaDir(folder), fileName), "utf-8");
}

function setValhallaFileContent(filePath: string[], content: string) {
  const fileName = filePath[filePath.length - 1]!!;
  const folder = filePath.slice(0, -1);
  if (!fs.existsSync(getValhallaDir(folder))) {
    createValhallaDir(folder);
  }
  fs.writeFileSync(
    path.join(getValhallaDir(folder), fileName),
    content,
    "utf-8",
  );
}

export async function getConfigurationJson(
  resource: string,
  relativePath: string[],
): Promise<ConfigurationResult | null> {
  const resourcePath = await api.resourcePaths.getResourcePath({
    name: resource,
  });
  if (!resourcePath) {
    return null;
  }
  const filePath = [resourcePath, ...relativePath];
  const fileName = filePath[filePath.length - 1]!!;
  if (!fs.existsSync(path.join(...filePath))) {
    return { path: filePath, name: fileName };
  }
  const folder = filePath.slice(0, -1);
  let actualCacheFileName = fileName.endsWith(".json")
    ? fileName
    : fileName + ".json";

  let content = convertConfigurationToJson(
    fileName,
    fs.readFileSync(path.join(...folder, fileName), "utf-8"),
  );

  if (fs.existsSync(path.join(getValhallaDir(folder), actualCacheFileName))) {
    const cache = JSON.parse(
      getValhallaFileContent([...folder, actualCacheFileName]) || "{}",
    );

    return {
      cache,
      content: content,
      name: fileName,
      path: filePath,
    };
  }
  return {
    cache: content,
    content: content,
    name: fileName,
    path: filePath,
  };
}

export async function setConfigurationJson(
  resource: string,
  relativePath: string[],
  cache: any,
  content: any,
) {
  const resourcePath = await api.resourcePaths.getResourcePath({
    name: resource,
  });
  if (!resourcePath) {
    return;
  }
  const filePath = [resourcePath, ...relativePath];
  const fileName = filePath[filePath.length - 1]!!;
  const folder = filePath.slice(0, -1);
  let actualCacheFileName = fileName.endsWith(".json")
    ? fileName
    : fileName + ".json";

  fs.writeFileSync(
    path.join(...folder, fileName),
    convertJsonToConfiguration(fileName, content),
    "utf-8",
  );

  setValhallaFileContent(
    [...folder, actualCacheFileName],
    JSON.stringify(cleanObject(cache), null, 2),
  );
}

export type ConfigurationResult = {
  content?: any;
  cache?: any;
  type?: string;
  name: string;
  path: string[];
};
