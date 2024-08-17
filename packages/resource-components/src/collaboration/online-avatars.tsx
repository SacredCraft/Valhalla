import React, { useEffect } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";
import { useRoom } from "./room";

export const OnlineAvatars = () => {
  const { setHeaderActions } = useResourceFileContext();
  const { selfAwareness, otherAwareness } = useRoom();

  useEffect(() => {
    setHeaderActions(
      <OnlineAvatarInner
        selfAwareness={selfAwareness}
        otherAwareness={otherAwareness}
      />,
    );
  }, [selfAwareness, otherAwareness, setHeaderActions]);

  return null;
};

type UserAwareness = {
  name: string;
  avatar: string | null;
  color: string;
  clientID?: number;
};

const OnlineAvatarInner = ({
  selfAwareness,
  otherAwareness,
}: {
  selfAwareness: any;
  otherAwareness: any;
}) => {
  const list = [selfAwareness, ...otherAwareness];
  return (
    <div className="flex items-center h-auto w-full">
      {list.filter(Boolean).map((user: UserAwareness) => (
        <Tooltip key={user.clientID ?? user.name}>
          <TooltipTrigger>
            <Avatar
              className="flex shrink-0 overflow-hidden size-6 rounded-full -ms-0.5 ring-2 ring-offset-2 ring-offset-background"
              style={
                {
                  backgroundColor: user.color,
                  "--tw-ring-color": user.color,
                } as React.CSSProperties
              }
            >
              {user.avatar && (
                <AvatarImage
                  className="aspect-square h-full w-full"
                  src={user.avatar}
                />
              )}
              {user.name && (
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              )}
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{user.name}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
