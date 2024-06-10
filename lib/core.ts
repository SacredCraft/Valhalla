"use server";

import fs from "fs";
import { flatMap, map, merge } from "lodash";
import path from "path";

import { getPlugin } from "@/config/plugins";
import { convertConfigurationToJson, toResult } from "@/lib/core-utils";

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

export async function getRelations(
  pluginId: string,
  pluginPath: string,
  filePath: string[],
) {
  const plugin = getPlugin(pluginId);
  if (filePath.length === 1) {
    const file = plugin?.dirs[0].files?.find((file) => file.id === filePath[0]);
    if (file?.relations?.enable) {
      const relationsValue = file.relations.value;
      return mapRelationsValueToConfiguration(
        pluginPath,
        relationsValue,
        filePath,
      );
    }
    if (plugin?.dirs[0].relations?.enable) {
      const relationsValue = plugin.dirs[0].relations.value;
      return mapRelationsValueToConfiguration(
        pluginPath,
        relationsValue,
        filePath,
      );
    }
  } else {
    const dir = plugin?.dirs.find((dir) => dir.id === filePath[0]);
    if (dir?.relations?.enable) {
      const relationsValue = dir.relations.value;
      return mapRelationsValueToConfiguration(
        pluginPath,
        relationsValue,
        filePath,
      );
    }
  }
  return null;
}

export async function getConfigurationJson(
  filePath: string[],
): Promise<ConfigurationResult> {
  const fileName = filePath[filePath.length - 1];
  if (!fs.existsSync(path.join(...filePath))) {
    return { exists: false, path: filePath, name: fileName };
  }
  const folder = filePath.slice(0, -1);
  let actualCacheFileName = fileName.endsWith(".json")
    ? fileName
    : fileName + ".json";

  let raw = fs.readFileSync(path.join(...folder, fileName), "utf-8");
  let content = convertConfigurationToJson(fileName, raw);

  if (fs.existsSync(path.join(getValhallaDir(folder), actualCacheFileName))) {
    const cacheContent = JSON.parse(
      getValhallaFileContent([...folder, actualCacheFileName]) || "{}",
    );

    return {
      raw,
      content: JSON.stringify(merge(content, cacheContent)),
      exists: true,
      name: fileName,
      path: filePath,
    };
  }
  return {
    raw,
    content: JSON.stringify(content),
    exists: true,
    name: fileName,
    path: filePath,
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
  name: string;
  path: string[];
};
