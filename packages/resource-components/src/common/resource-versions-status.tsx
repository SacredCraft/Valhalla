import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@sacred-craft/valhalla-components";
import { User } from "@sacred-craft/valhalla-database";

import { useResourceVersionsContext } from "../essential/providers";

export const ResourceVersionsStatus = () => {
  const { latestVersion, isLatestVersion } = useResourceVersionsContext();

  return (
    <Tooltip>
      <TooltipContent>
        {isLatestVersion ? (
          "The current file is the latest version"
        ) : (
          <div className="flex flex-col">
            <span className="text-[10px] mb-1">
              The current file has been modified, the latest changes:
            </span>
            {latestVersion && (
              <>
                <span className="text-[10px] text-gray-400 dark:text-gray-700">
                  {latestVersion.comment ?? "Auto Save"}
                </span>
                <span className="text-[8px] text-gray-400 dark:text-gray-700">
                  {new Date(latestVersion.timestamp).toLocaleString()}
                </span>
              </>
            )}
            <span className="text-[8px] text-gray-400 dark:text-gray-700 mt-1">
              {(latestVersion?.operators as User[] | undefined)?.map(
                (operator) => (
                  <Avatar className="size-4">
                    <AvatarFallback>
                      {operator.username.slice(0, 2)}
                    </AvatarFallback>
                    {operator.avatar && <AvatarImage src={operator.avatar} />}
                  </Avatar>
                ),
              )}
            </span>
          </div>
        )}
      </TooltipContent>
      <TooltipTrigger className="flex items-center font-mono">
        <Badge className="rounded-sm">
          <span
            className={cn(
              "rounded-full size-2 mr-1.5",
              isLatestVersion ? "bg-green-500" : "bg-red-500",
            )}
          />
          {isLatestVersion ? "Latest" : "Outdated"}
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  );
};
