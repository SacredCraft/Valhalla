"use client";

import ky from "ky";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";

import { HocuspocusProvider } from "@hocuspocus/provider";
import {
  Editor,
  type EditorProps,
  cn,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";
import { Cursors } from "./cursor";
import { Room, useRoom } from "./room";

export const ResourceRealtimeMonacoEditor = () => {
  const { meta, resource } = useResourceFileContext();
  const [cookies, setCookies] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    ky.get("/api/auth/cookies").text().then(setCookies);
    ky.get("/api/auth/profile").json<{ username: string }>().then(setUser);
  }, []);

  return (
    <Room roomName={`${resource.name} ${meta.path.join("/")}`}>
      {cookies && user && (
        <ResourceRealtimeMonacoEditorInner cookies={cookies} user={user} />
      )}
    </Room>
  );
};

export const ResourceRealtimeMonacoEditorInner = ({
  cookies,
  user,
  ...editorProps
}: EditorProps & { cookies: string; user: { username: string } }) => {
  const { theme } = useTheme();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [provider, setProvider] = useState<HocuspocusProvider>();
  const [mounted, setMounted] = useState(false);
  const { contentCache, setContentCache, meta } = useResourceFileContext();
  const [contentInitialed, setContentInitialed] = useState(false);

  const { socket, roomName } = useRoom();

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const provider = new HocuspocusProvider({
      websocketProvider: socket,
      name: roomName,
      token: cookies,
    });

    setProvider(provider);

    return () => {
      provider?.destroy();
    };
  }, [roomName]);

  useEffect(() => {
    if (provider && !contentInitialed) {
      provider.on("synced", () => {
        setContentInitialed(true);
        const type = provider.document.getText("monaco");
        if (contentCache && !type.toJSON()) {
          type.insert(0, contentCache.toString());
        }
      });
    }
  }, [provider, contentCache, contentInitialed]);

  useEffect(() => {
    if (mounted && editorRef && provider) {
      const ydoc = provider.document;

      const awareness = provider.awareness;
      const type = ydoc.getText("monaco");

      let binding: MonacoBinding | undefined;
      if (typeof window !== "undefined") {
        binding = new MonacoBinding(
          type,
          editorRef.getModel()!,
          new Set([editorRef]),
          awareness,
        );
      }

      return () => {
        ydoc?.destroy();
        binding?.destroy();
        awareness?.destroy();
      };
    }
  }, [editorRef, provider, mounted]);

  return (
    <>
      {contentInitialed && (
        <Editor
          loading={false}
          height="calc(100vh - 6rem)"
          path={meta.path.join("/")}
          onMount={handleOnMount}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          onChange={(value) => setContentCache(value)}
          {...editorProps}
        />
      )}
      {!contentInitialed && (
        <div className="flex items-center justify-center">Loading...</div>
      )}
      <Cursors provider={provider} username={user.username} />
    </>
  );
};
