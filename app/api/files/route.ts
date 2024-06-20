import fs from "fs";
import path from "path";

import { getPluginPath } from "@/lib/cookies";

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
