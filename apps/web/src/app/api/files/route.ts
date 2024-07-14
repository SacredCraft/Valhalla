import fs from "fs";
import path from "path";

import { getPluginPath } from "@//app/actions";

export async function POST(request: Request) {
  const formData = await request.formData();

  const pluginId = formData.get("pluginId") as string;
  const relativePath = formData.get("relativePath") as string;
  const files = formData.getAll("files") as File[];

  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return new Response(null, { status: 404 });
  }

  const filePath = path.join(pluginPath, relativePath);

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
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get("relativePath") as string;
  const pluginId = searchParams.get("pluginId") as string;

  const pluginPath = await getPluginPath(pluginId);
  if (!pluginPath) {
    return new Response(null, { status: 404 });
  }

  const filePath = path.join(pluginPath, relativePath);
  if (!fs.existsSync(filePath)) {
    return new Response(null, { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const headers = new Headers();
  headers.set(
    "Content-Disposition",
    `attachment; filename="${path.basename(filePath)}"`,
  );
  return new Response(content, { headers });
}
