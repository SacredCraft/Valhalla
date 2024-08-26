import { useEffect, useMemo } from "react";

import type { HocuspocusProvider } from "@hocuspocus/provider";

import { useResourceFileContext } from "../essential/providers";
import { BasicAwareness } from "./basic-awareness";
import { useRoom } from "./room";

type Props = {
  provider: HocuspocusProvider | null;
  username: string;
  avatar: string | null;
};

type UserAwareness = {
  name: string;
  avatar: string | null;
  color: string;
  clientID?: number;
};

export function MonacoAwareness({ username, avatar }: Props) {
  const { render } = useResourceFileContext();
  const { otherAwareness, setSelfAwareness } = useRoom();

  const user: BasicAwareness = useMemo(
    () => ({
      name: username,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      avatar,
      location: render.value,
    }),
    [username, avatar, render],
  );

  useEffect(() => {
    setSelfAwareness(user);
  }, [user, setSelfAwareness]);

  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    otherAwareness.forEach((user: UserAwareness) => {
      cursorStyles += `
          .yRemoteSelection-${user.clientID},
          .yRemoteSelectionHead-${user.clientID}  {
            --user-color: ${user.color};
          }

          .yRemoteSelectionHead-${user.clientID}::after {
            content: "${user.name}";
          }
        `;
    });

    return { __html: cursorStyles };
  }, [otherAwareness]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
