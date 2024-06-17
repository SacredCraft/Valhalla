"use server";

import fs from "fs";
import { flatMap } from "lodash";
import path from "path";

import {
  convertConfigurationToJson,
  convertJsonToConfiguration,
} from "@/lib/core-utils";

export type Trash = {
  fileName: string;
  operator: string;
  deletedAt: string;
  content?: any;
  size?: number;
  path: string[];
  type: "json" | "base64";
};

function findValhallaDirs(dir: string): string[] {
  let valhallaDirs: string[] = [];

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      if (file === ".valhalla") {
        valhallaDirs.push(fullPath);
      } else {
        valhallaDirs = valhallaDirs.concat(findValhallaDirs(fullPath));
      }
    }
  });

  return valhallaDirs;
}

// 递归删除 valhalla 目录中以 ".deleted" 结尾的文件
export async function emptyTrash(filePath: string) {
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isDirectory()) {
    return;
  }

  const valhallaDirs = findValhallaDirs(filePath);

  for (const dir of valhallaDirs) {
    emptyTrashRecursive(dir);
  }
}

function emptyTrashRecursive(dir: string) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      emptyTrashRecursive(fullPath);
    } else if (stat.isFile() && file.endsWith(".deleted")) {
      fs.unlinkSync(fullPath);
    }
  });
}

// 递归查找 valhalla 目录中以 ".deleted" 结尾的文件
export async function getDeletedFiles(filePath: string): Promise<Trash[]> {
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isDirectory()) {
    return [];
  }

  const valhallaDirs = findValhallaDirs(filePath);
  let allResults: string[] = [];

  for (const dir of valhallaDirs) {
    const deletedFiles = getDeletedFilesRecursive(dir);
    allResults = allResults.concat(deletedFiles);
  }

  return allResults.map((r) => {
    const content: {
      operator: string;
      type: "json" | "base64";
      time: string;
      content: any;
    } = JSON.parse(fs.readFileSync(r, "utf-8"));

    let contentValue;

    if (content.type === "json") {
      contentValue = content.content;
    } else {
      contentValue = Buffer.from(content.content, "base64").toString("utf-8");
    }

    return {
      fileName: path.basename(r).replace(".deleted", ""),
      operator: content.operator,
      deletedAt: content.time,
      type: content.type,
      content: contentValue,
      size: fs.statSync(r).size,
      path: r.split("/"),
    };
  });
}

function getDeletedFilesRecursive(dir: string): string[] {
  let results: string[] = [];

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getDeletedFilesRecursive(fullPath));
    } else if (stat.isFile() && file.endsWith(".deleted")) {
      results.push(fullPath);
    }
  });

  return results;
}

function getValhallaDir(filePath: string[]) {
  return path.join(...filePath, ".valhalla");
}

function createValhallaDir(filePath: string[]) {
  fs.mkdirSync(getValhallaDir(filePath));
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
