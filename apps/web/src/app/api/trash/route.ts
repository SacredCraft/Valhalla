import fs from "fs";
import path from "path";

import { Trash } from "@/server/api/routers/files";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import valhallaConfig from "@/valhalla";

export const GET = async (request: Request) => {
  // if (!request.auth) {
  //   return new Response(null, { status: 401 });
  // }

  const { searchParams } = new URL(request.url);

  const resource = searchParams.get("resource") as string;

  const ownedResources = await api.resources.getOwnedResources();

  if (!ownedResources.some((r) => r === resource)) {
    return new Response(null, { status: 403 });
  }

  const resourcePath = await api.resourcePaths.getResourcePath({
    name: resource,
  });
  if (!resourcePath) {
    return new Response(null, { status: 404 });
  }

  const trashName = searchParams.get("trashName") as string;

  const filesPath = path.join(
    resourcePath,
    valhallaConfig.folders.valhalla,
    valhallaConfig.folders.files,
  );

  const trashPath = path.join(
    resourcePath,
    valhallaConfig.folders.valhalla,
    valhallaConfig.folders.trash,
  );

  const filePath = path.join(filesPath, trashName);

  try {
    if (!fs.existsSync(trashPath)) {
      return new Response(null, { status: 404 });
    }

    const meta = JSON.parse(
      fs.readFileSync(path.join(trashPath, trashName + ".json"), "utf-8"),
    ) as Trash;

    const content = fs.readFileSync(filePath);

    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");

    return new Response(content, { headers });
  } catch (error) {
    console.log(error);

    return new Response(null, { status: 500 });
  }
};
