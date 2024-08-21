"use client";

import ky from "ky";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { User } from "@sacred-craft/valhalla-database";

import { useResourceFileContext } from "../essential/providers";
import { OnlineAvatars } from "./online-avatars";

type ContextType = {
  provider: HocuspocusProvider;
  roomName: string;
  cookies: string;
  user: User;
  selfAwareness: any;
  otherAwareness: any[];
  // eslint-disable-next-line no-unused-vars
  setSelfAwareness: (selfAwareness: any) => void;
  usersAwareness: any[];
  // eslint-disable-next-line no-unused-vars
  setUsersAwareness: (usersAwareness: any[]) => void;
};

const RoomContext = createContext<ContextType | null>(null);

export const useRoom = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};

export const Room = ({
  children,
  setUsers,
}: {
  children?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  setUsers: (users: number) => void;
}) => {
  const { meta, resource } = useResourceFileContext();
  const [cookies, setCookies] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    ky.get("/api/auth/cookies").text().then(setCookies);
    ky.get("/api/auth/profile").json<User>().then(setUser);
  }, []);

  return (
    cookies &&
    user && (
      <RoomInner
        cookies={cookies}
        user={user}
        roomName={`${resource.name} ${meta.path.join("/")}`}
        setUsersCount={setUsers}
      >
        {children}
      </RoomInner>
    )
  );
};

const RoomInner = ({
  roomName,
  children,
  cookies,
  user,
  setUsersCount,
}: {
  roomName: string;
  children?: React.ReactNode;
  cookies: string;
  user: User;
  // eslint-disable-next-line no-unused-vars
  setUsersCount: (users: number) => void;
}) => {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const [selfAwareness, setSelfAwareness] = useState<any>(null);
  const [usersAwareness, setUsersAwareness] = useState<any[]>([]);

  const otherAwareness = useMemo(() => {
    return usersAwareness.filter(
      (user) => user.clientID !== selfAwareness?.clientID,
    );
  }, [usersAwareness, selfAwareness]);

  useEffect(() => {
    setUsersCount(usersAwareness.length);
  }, [usersAwareness]);

  useEffect(() => {
    provider?.awareness?.setLocalStateField("user", selfAwareness);
  }, [selfAwareness]);

  useEffect(() => {
    function setUsers() {
      const users = (provider?.awareness?.getStates() ?? []).entries();
      const array = Array.from(users).map(([clientID, state]) => ({
        ...state.user,
        clientID,
      }));

      setUsersAwareness(array);
    }

    provider?.awareness?.on("change", setUsers);
    setUsers();

    return () => {
      provider?.awareness?.off("change", setUsers);
    };
  }, [provider]);

  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: getBaseUrl(),
      name: roomName,
      token: cookies,
    });

    setProvider(provider);

    return () => {
      provider?.destroy();
    };
  }, [roomName]);

  return (
    provider && (
      <RoomContext.Provider
        value={{
          provider,
          roomName,
          cookies,
          user,
          selfAwareness,
          otherAwareness,
          setSelfAwareness,
          usersAwareness,
          setUsersAwareness,
        }}
      >
        {children}
        <OnlineAvatars />
      </RoomContext.Provider>
    )
  );
};

function getBaseUrl() {
  if (typeof window !== "undefined")
    // eslint-disable-next-line no-undef
    return window.location.origin.replace(/^http/, "ws");
  if (process.env.VERCEL_URL) return `ws://${process.env.VERCEL_URL}`;
  return `ws://localhost:${process.env.PORT ?? 3000}`;
}
