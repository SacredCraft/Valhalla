"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { HocuspocusProviderWebsocket } from "@hocuspocus/provider";

type ContextType = {
  socket: HocuspocusProviderWebsocket;
  roomName: string;
};

const RoomContext = createContext<ContextType | null>(null);

export const useRoom = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};

const RoomMounted = ({
  roomName,
  children,
}: {
  roomName: string;
  children?: React.ReactNode;
}) => {
  const socket = new HocuspocusProviderWebsocket({
    url: getBaseUrl(),
  });

  return (
    <RoomContext.Provider value={{ socket, roomName }}>
      {children}
    </RoomContext.Provider>
  );
};

export const Room = ({
  roomName,
  children,
}: {
  roomName: string;
  children?: React.ReactNode;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <RoomMounted roomName={roomName}>{children}</RoomMounted>
  ) : null;
};

function getBaseUrl() {
  if (typeof window !== "undefined")
    return window.location.origin.replace(/^http/, "ws");
  if (process.env.VERCEL_URL) return `ws://${process.env.VERCEL_URL}`;
  return `ws://localhost:${process.env.PORT ?? 3000}`;
}
