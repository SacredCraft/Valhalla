import { useEffect, useMemo } from "react";

import type { HocuspocusProvider } from "@hocuspocus/provider";

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

export function MonacoCursors({ username, avatar }: Props) {
  const { otherAwareness, setSelfAwareness, provider } = useRoom();

  const user = useMemo(
    () => ({
      name: username,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      avatar,
    }),
    [username, avatar],
  );

  useEffect(() => {
    setSelfAwareness({
      ...user,
      clientID: provider?.awareness?.clientID,
    });
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
