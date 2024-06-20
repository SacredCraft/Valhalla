"use server";

import { revalidatePath } from "next/cache";

import fs from "fs";
import path from "path";

import { getPluginPath, setPluginPath } from "@/lib/cookies";

export type ValhallaFile = {
  type: "dir" | "file";
  name: string;
  path: string[];
  size: number;
  createdAt: string;
  updatedAt: string;
};

export async function getPluginFiles(
  pluginId: string,
  relativePath: string[],
): Promise<ValhallaFile[] | undefined> {
  const pluginPath = await getPluginPath(pluginId);
  const absolutePath = pluginPath ? [pluginPath, ...relativePath] : [];
  try {
    const mappedFiles = fs
      .readdirSync(absolutePath.map((i) => decodeURIComponent(i)).join("/"))
      .filter((file) => !file.startsWith("."))
      .map(async (file) => {
        const stats = fs.statSync(
          `${absolutePath.map((i) => decodeURIComponent(i)).join("/")}/${file}`,
        );
        return {
          type: stats.isDirectory() ? "dir" : "file",
          name: file,
          path: `${relativePath.length !== 0 ? `${relativePath.join(path.sep)}/` : ``}${file}`.split(
            path.sep,
          ),
          createdAt: stats.birthtime.toLocaleString(),
          updatedAt: stats.mtime.toLocaleString(),
          size: stats.size,
        } as ValhallaFile;
      });

    const files = await Promise.all(mappedFiles);

    return files.sort((a, b) => {
      if (a.type === "dir" && b.type !== "dir") {
        return -1;
      }
      if (a.type !== "dir" && b.type === "dir") {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    return undefined;
  }
}

export async function getFile(
  pluginId: string,
  relativePath: string,
): Promise<(ValhallaFile & { ext?: string }) | null> {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return null;
  }
  const filePath = path.join(pluginPath, relativePath);
  const stats = fs.statSync(filePath);

  return {
    type: stats.isDirectory() ? "dir" : "file",
    name: path.basename(filePath),
    path: relativePath.split(path.sep),
    createdAt: stats.birthtime.toLocaleString(),
    updatedAt: stats.mtime.toLocaleString(),
    size: stats.size,
    ext: path.extname(filePath).slice(1),
  };
}

export async function uploadFile(
  pluginId: string,
  relativePath: string,
  fileName: string,
  formData: FormData,
): Promise<boolean> {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return false;
  }

  const filePath = path.join(pluginPath, relativePath);

  try {
    const file = formData.get("file") as File;
    // 创建目录，如果已存在则忽略
    fs.mkdirSync(filePath, { recursive: true });

    const fileData = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileData);
    const fileDest = path.join(filePath, fileName);

    // 写入文件到指定路径
    fs.writeFileSync(fileDest, fileBuffer);

    return true;
  } catch (error) {
    console.error("Error uploading files:", error);
    return false;
  }
}

export async function savePath(formData: FormData) {
  const path = formData.get("path") as string;
  const pluginId = formData.get("pluginId") as string;

  await setPluginPath(pluginId, path);
}

export async function deleteFile(
  pluginId: string,
  relativePath: string,
): Promise<boolean> {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return false;
  }
  try {
    fs.unlinkSync(path.join(pluginPath, relativePath));
    return true;
  } catch (error) {
    return false;
  }
}

export async function renameFile(
  pluginId: string,
  oldPath: string,
  newPath: string,
) {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return;
  }
  fs.renameSync(path.join(pluginPath, oldPath), path.join(pluginPath, newPath));
}

export async function createFile(
  pluginId: string,
  relativePath: string,
  type: "file" | "dir",
  content?: string,
) {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return false;
  }
  const filePath = path.join(pluginPath, relativePath);
  try {
    if (type === "dir") {
      fs.mkdirSync(filePath);
    } else {
      fs.writeFileSync(filePath, content || "");
    }
    return true;
  } catch (error) {
    console.log(relativePath);
    return false;
  }
}

export async function saveFile(
  pluginPath: string,
  filePath: string,
  content: string,
) {
  fs.writeFileSync(path.join(pluginPath, filePath), content);
}

export async function getFileContent(
  pluginId: string,
  relativePath: string,
  options:
    | {
        encoding: BufferEncoding;
        flag?: string | undefined;
      }
    | BufferEncoding,
) {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return;
  }
  return fs.readFileSync(path.join(pluginPath, relativePath), options);
}

export async function revalidate(path: string) {
  revalidatePath(path);
}
