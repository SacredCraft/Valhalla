"use client";

import { useFilesContext } from "@/app/(main)/resources/[resource]/files/layout.client";
import { useResourceContext } from "@/app/(main)/resources/[resource]/layout.client";
import valhallaConfig from "@/valhalla";
import { getTemplateByPath } from "@sacred-craft/valhalla-resource";

export default function EditorPage() {
  const { resource } = useResourceContext();
  const { relativePath } = useFilesContext();
  const template = getTemplateByPath(relativePath, resource, valhallaConfig);

  if (template?.action && "render" in template.action) {
    return template.action.render.editor?.();
  }
}
