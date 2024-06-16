"use server";

import fs from "fs";
import { flatMap } from "lodash";
import path from "path";

import { getPlugin } from "@/config/utils";
import {
  convertConfigurationToJson,
  convertJsonToConfiguration,
} from "@/lib/core-utils";

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

function mapRelationsValueToConfiguration(
  pluginPath: string,
  value: any,
  filePath: string[],
) {
  let res: ConfigurationResult[] = [];
  if (value.type === "file") {
    flatMap(value.ids, (id: string) => {
      getConfigurationJson([pluginPath, id]).then((configuration) => {
        res.push(configuration);
      });
    });
  } else {
    flatMap(value.ids, (id: string) => {
      flatMap(fs.readdirSync(path.join(pluginPath, id)), (file) => {
        if (file === ".DS_Store" || file === ".valhalla") {
          return;
        }
        getConfigurationJson([pluginPath, id, file]).then((configuration) => {
          if (configuration.path.slice(1).join("/") !== filePath.join("/")) {
            res.push(configuration);
          }
        });
      });
    });
  }
  return res;
}

export async function getConfigurationJson(
  filePath: string[],
): Promise<ConfigurationResult> {
  const fileName = filePath[filePath.length - 1];
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
  filePath: string[],
  cache: any,
  content: any,
) {
  const fileName = filePath[filePath.length - 1];
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
    JSON.stringify(cache, null, 2),
  );
}

export type ConfigurationResult = {
  content?: any;
  cache?: any;
  type?: string;
  name: string;
  path: string[];
};
