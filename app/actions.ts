"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

import fs from "fs";
import path from "path";

import { signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";

export async function getAllPluginPaths(): Promise<Map<string, string>> {
  const paths = new Map<string, string>();

  const res = await prisma.pluginPath.findMany();

  if (!res) {
    return paths;
  }

  for (const path of res) {
    paths.set(path.pluginId, path.path);
  }

  return paths;
}

export async function getPluginPath(id: string): Promise<string | null> {
  const res = await prisma.pluginPath.findUnique({
    where: {
      pluginId: id,
    },
  });

  if (!res) {
    return null;
  }

  return res.path;
}

export async function setPluginPath(id: string, path: string) {
  await prisma.pluginPath.upsert({
    where: {
      pluginId: id,
    },
    update: {
      path,
    },
    create: {
      pluginId: id,
      path,
    },
  });
}

export async function logout() {
  await signOut();
}

export async function signInAction(
  username: string,
  password: string,
): Promise<boolean> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  try {
    await signIn("credentials", formData);
    return true;
  } catch (error) {
    return !!isRedirectError(error);
  }
}

export type ValhallaFile = {
  type: "dir" | "file";
  name: string;
  path: string[];
  size: number;
  createdAt: string;
  updatedAt: string;
};

export async function copyFile(
  pluginId: string,
  source: string,
  destination: string,
  cut: boolean = false,
): Promise<boolean | "exist"> {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return false;
  }

  const sourceFile = path.join(pluginPath, source);
  const destinationFile = path.join(
    pluginPath,
    destination,
    path.basename(source),
  );

  let result: boolean | "exist" = false;

  try {
    fs.accessSync(destinationFile, fs.constants.F_OK);
    result = "exist";
  } catch (error) {
    try {
      fs.copyFileSync(sourceFile, destinationFile);
      if (cut) {
        fs.unlinkSync(sourceFile);
      }
      result = true;
    } catch (error) {
      result = false;
    }
  }

  return result;
}

export async function replaceFile(
  pluginId: string,
  source: string,
  destination: string,
): Promise<boolean> {
  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return false;
  }

  const sourceFile = path.join(pluginPath, source);
  const destinationFile = path.join(pluginPath, destination);
  try {
    fs.copyFileSync(sourceFile, destinationFile);
    return true;
  } catch (error) {
    return false;
  }
}

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
    return false;
  }
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
