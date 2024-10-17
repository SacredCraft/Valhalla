import fs from "fs";
import path from "path";

import valhallaConfig from "@/config";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export const POST = auth(async (request) => {
  if (!request.auth) {
    return new Response(null, { status: 401 });
  }

  const formData = await request.formData();

  const resource = formData.get("resource") as string;

  const ownedResources = await api.resources.getOwnedResources();

  if (!ownedResources.some((r) => r === resource)) {
    return new Response(null, { status: 403 });
  }

  const relativePath = formData.get("relativePath") as string;
  const files = formData.getAll("files") as File[];

  const resourcePath = await api.resources.getResourcePath({
    name: resource,
  });
  if (!resourcePath) {
    return new Response(null, { status: 404 });
  }

  const filePath = path.join(resourcePath, relativePath);

  // 文件大小检查
  const fileSize = files.reduce((acc, file) => acc + file.size, 0);
  if (fileSize > valhallaConfig.limits.uploadFileSize) {
    return new Response(null, { status: 413 });
  }

  try {
    fs.mkdirSync(filePath, { recursive: true });
    for (const file of files) {
      const fileData = await file.arrayBuffer();
      const fileBuffer = Buffer.from(fileData);
      const fileDest = path.join(filePath, file.name);

      fs.writeFileSync(fileDest, fileBuffer);
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
});

export const GET = auth(async (request) => {
  if (!request.auth) {
    return new Response(null, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const resource = searchParams.get("resource") as string;

  const ownedResources = await api.resources.getOwnedResources();

  if (!ownedResources.some((r) => r === resource)) {
    return new Response(null, { status: 403 });
  }

  const relativePath = searchParams.get("relativePath") as string;

  if (!relativePath || !resource) {
    return new Response(null, { status: 400 });
  }

  const resourcePath = await api.resources.getResourcePath({
    name: resource,
  });
  if (!resourcePath) {
    return new Response(null, { status: 404 });
  }

  const filePath = path.join(resourcePath, relativePath);
  if (!fs.existsSync(filePath)) {
    return new Response(null, { status: 404 });
  }

  const content = fs.readFileSync(filePath);
  const headers = new Headers();
  headers.set("Content-Type", "application/octet-stream");
  return new Response(content, { headers });
});
