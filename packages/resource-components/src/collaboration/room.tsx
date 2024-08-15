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

export const Room = ({
  roomName,
  children,
}: {
  roomName: string;
  children?: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<HocuspocusProviderWebsocket | null>(
    null,
  );

  useEffect(() => {
    const instance = new HocuspocusProviderWebsocket({
      url: getBaseUrl(),
    });

    setSocket(instance);

    return () => {
      socket?.disconnect();
      socket?.destroy();
    };
  }, []);

  return (
    socket && (
      <RoomContext.Provider value={{ socket, roomName }}>
        {children}
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
