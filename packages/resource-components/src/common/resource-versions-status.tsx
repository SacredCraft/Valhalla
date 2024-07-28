import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sacred-craft/valhalla-components";

import { useResourceVersionsContext } from "../essential/providers";

export const ResourceVersionsStatus = () => {
  const { latestVersion, currentVersion, isLatestVersion } =
    useResourceVersionsContext();

  return (
    <div className="flex items-center space-x-2">
      <Tooltip>
        <TooltipContent>Current Version</TooltipContent>
        <TooltipTrigger className="flex items-center">
          <span className="bg-green-500 rounded-full size-2 mr-1" />{" "}
          {currentVersion}
        </TooltipTrigger>
      </Tooltip>
      {!isLatestVersion && (
        <Tooltip>
          <TooltipContent>Latest Version</TooltipContent>
          <TooltipTrigger className="flex items-center">
            <span className="bg-red-500 rounded-full size-2 mr-1" />{" "}
            {latestVersion?.version}
          </TooltipTrigger>
        </Tooltip>
      )}
    </div>
  );
};
