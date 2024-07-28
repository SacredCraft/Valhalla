import { useEffect } from "react";

import { toast } from "@sacred-craft/valhalla-components";

import { useResourceVersionsContext } from "../essential/providers";

export const ResourceVersionsMessage = () => {
  const { latestVersion, isLatestVersion } = useResourceVersionsContext();

  useEffect(() => {
    if (!isLatestVersion) {
      toast.warning(
        "The current file has been modified, the latest changes: " +
          latestVersion?.comment,
      );
    }
  }, [isLatestVersion, latestVersion]);

  return null;
};
