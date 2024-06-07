"use server";

import fs from "fs";
import path from "path";

import { setPluginPath } from "@/lib/cookies";

export type File = {
  files?: File[];
  dir: boolean;
  name: string;
  path: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export async function getFilesByPluginAndDir(
  pluginPath: string,
  dir: string,
): Promise<File[] | undefined> {
  let actualPath: string;
  if (dir === "root") {
    actualPath = pluginPath;
  } else {
    actualPath = path.join(pluginPath, dir);
  }
  try {
    const mappedFiles = fs
      .readdirSync(actualPath)
      .filter(
        (file) =>
          (dir === "root"
            ? fs.statSync(`${actualPath}/${file}`).isFile()
            : true) && !file.startsWith("."),
      )
      .map(async (file) => {
        const stats = fs.statSync(`${actualPath}/${file}`);
        return {
          dir: stats.isDirectory(),
          name: file,
          path: `${actualPath}/${file}`,
          createdAt: stats.birthtime.toLocaleString(),
          updatedAt: stats.mtime.toLocaleString(),
          size: stats.size,
          files: stats.isDirectory()
            ? await getFilesByPluginAndDir(actualPath, file)
            : undefined,
        } as File;
      });

    const files = await Promise.all(mappedFiles);

    return files.sort((a, b) => {
      if (a.dir && !b.dir) {
        return -1;
      }
      if (!a.dir && b.dir) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    return undefined;
  }
}

export async function getFile(
  pluginPath: string,
  filePath: string,
): Promise<File & { type?: string }> {
  const stats = fs.statSync(path.join(pluginPath, filePath));

  return {
    dir: false,
    name: path.basename(filePath),
    path: filePath,
    createdAt: stats.birthtime.toLocaleString(),
    updatedAt: stats.mtime.toLocaleString(),
    size: stats.size,
    type: path.extname(filePath).slice(1),
  };
}

export async function savePath(formData: FormData) {
  const path = formData.get("path") as string;
  const pluginId = formData.get("pluginId") as string;

  setPluginPath(pluginId, path);
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function renameFile(oldPath: string, newPath: string) {
  fs.renameSync(oldPath, newPath);
}

export async function saveFile(
  pluginPath: string,
  filePath: string,
  content: string,
) {
  fs.writeFileSync(path.join(pluginPath, filePath), content);
}
