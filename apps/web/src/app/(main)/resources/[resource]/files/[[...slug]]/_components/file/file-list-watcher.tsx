import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useRelativePath, useResourceContext } from "../../layout.client";

export const FileListWatcher = () => {
  const relativePath = useRelativePath();
  const [lastPath, setLastPath] = useState<string[]>([]);
  const { openedFiles, resource } = useResourceContext();
  const path = relativePath.join("/");
  const router = useRouter();

  const updateLastPath = useCallback(() => {
    const currentIndex = openedFiles.findIndex(
      (file) => file.path.join("/") === path,
    );
    if (currentIndex > 0) {
      setLastPath(openedFiles[currentIndex - 1].path);
    } else if (lastPath.length > 0) {
      setLastPath([]);
    }
  }, [openedFiles, path]);

  useEffect(() => {
    const isOpened = openedFiles?.some((file) => file.path.join("/") === path);
    if (!isOpened) {
      router.push(`/resources/${resource.name}/files/${lastPath.join("/")}`);
    } else {
      updateLastPath();
    }
  }, [path, openedFiles, router, resource.name, lastPath, updateLastPath]);

  return null;
};
