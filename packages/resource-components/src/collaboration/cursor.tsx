import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import type { HocuspocusProvider } from "@hocuspocus/provider";

type Props = {
  provider?: HocuspocusProvider;
};

type UserAwareness = {
  name: string;
  color: string;
  clientID?: number;
};

export function Cursors({ provider }: Props) {
  const [userAwareness, setUserAwareness] = useState<UserAwareness[]>([]);
  const session = useSession();

  const user = useMemo(
    () => ({
      name: (session.data?.user as any).username ?? "Anonymous",
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }),
    [(session.data?.user as any).username],
  );

  useEffect(() => {
    provider?.awareness?.setLocalStateField("user", user);

    function setUsers() {
      const users = (provider?.awareness?.getStates() ?? []).entries();

      setUserAwareness(
        Array.from(users).map(([clientID, state]) => ({
          ...(state.user as UserAwareness),
          clientID,
        })),
      );
    }

    provider?.awareness?.on("change", setUsers);
    setUsers();

    return () => {
      provider?.awareness?.off("change", setUsers);
    };
  }, [provider, user]);

  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    userAwareness.forEach((user) => {
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
  }, [userAwareness]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
