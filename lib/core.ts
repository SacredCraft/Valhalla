"use server";

import fs from "fs";
import { merge } from "lodash";
import path from "path";

import {
  convertConfigurationToJson,
  convertJsonToConfiguration,
  toResult,
} from "@/lib/core-utils";

import { isFormDeletableValue } from "./form";

function getValhallaDir(filePath: string[]) {
  return path.join(...filePath, ".valhalla");
}

function checkValhallaDirExists(filePath: string[]) {
  return fs.existsSync(getValhallaDir(filePath));
}

function createValhallaDir(filePath: string[]) {
  fs.mkdirSync(getValhallaDir(filePath));
}

function deleteValhallaDir(filePath: string[]) {
  fs.rmdirSync(getValhallaDir(filePath));
}

function deleteAllValhallaDirs(filePath: string[]) {
  let currentPath = "";
  for (const dir of filePath) {
    currentPath = path.join(currentPath, dir);
    if (fs.existsSync(path.join(currentPath, ".valhalla"))) {
      fs.rmdirSync(path.join(currentPath, ".valhalla"));
    }
  }
}

function getValhallaFileContent(filePath: string[]) {
  const fileName = filePath[filePath.length - 1];
  const folder = filePath.slice(0, -1);
  if (!fs.existsSync(getValhallaDir(folder))) {
    return null;
  }
  return fs.readFileSync(path.join(getValhallaDir(folder), fileName), "utf-8");
}

function setValhallaFileContent(filePath: string[], content: string) {
  const fileName = filePath[filePath.length - 1];
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

function deleteValhallaFile(filePath: string[]) {
  fs.unlinkSync(path.join(getValhallaDir(filePath)));
}

export async function getConfigurationJson(
  filePath: string[],
): Promise<ConfigurationResult> {
  if (!fs.existsSync(path.join(...filePath))) {
    return { exists: false };
  }
  const fileName = filePath[filePath.length - 1];
  const folder = filePath.slice(0, -1);
  let actualCacheFileName = fileName.endsWith(".json")
    ? fileName
    : fileName + ".json";

  let raw = fs.readFileSync(path.join(...folder, fileName), "utf-8");
  let content = convertConfigurationToJson(fileName, raw).toJSON();

  if (fs.existsSync(path.join(getValhallaDir(folder), actualCacheFileName))) {
    const cacheContent = JSON.parse(
      getValhallaFileContent([...folder, actualCacheFileName]) || "{}",
    );

    return {
      raw,
      content: JSON.stringify(merge(content, cacheContent)),
      exists: true,
    };
  }
  return {
    raw,
    content: JSON.stringify(content),
    exists: true,
  };
}

export async function setConfigurationJson(
  filePath: string[],
  contentToSave: any,
) {
  const fileName = filePath[filePath.length - 1];
  const folder = filePath.slice(0, -1);
  let actualCacheFileName = fileName.endsWith(".json")
    ? fileName
    : fileName + ".json";

  const { cache, raw } = toResult(fileName, contentToSave);

  fs.writeFileSync(path.join(...folder, fileName), raw, "utf-8");

  setValhallaFileContent(
    [...folder, actualCacheFileName],
    JSON.stringify(cache, null, 2),
  );
}

export type ConfigurationResult = {
  raw?: string;
  content?: string;
  exists: boolean;
  type?: string;
};
