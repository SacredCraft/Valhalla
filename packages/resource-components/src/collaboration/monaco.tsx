"use client";

import ky from "ky";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { Editor, type EditorProps } from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";
import { Cursors } from "./cursor";
import { useRoom } from "./room";

export const ResourceRealtimeMonacoEditor = (editorProps: EditorProps) => {
  const { theme } = useTheme();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [provider, setProvider] = useState<HocuspocusProvider>();
  const [mounted, setMounted] = useState(false);
  const { contentCache, setContentCache, meta } = useResourceFileContext();

  const { socket, roomName } = useRoom();

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function createProvider() {
      const cookies = await ky.get("/api/auth/cookies").text();

      const provider = new HocuspocusProvider({
        websocketProvider: socket,
        name: roomName,
        token: cookies,
      });

      setProvider(provider);
    }

    createProvider();

    return () => {
      provider?.destroy();
    };
  }, [roomName, socket]);

  useEffect(() => {
    if (mounted && editorRef && provider) {
      const ydoc = provider.document;

      const awareness = provider.awareness;
      const type = ydoc.getText("monaco");

      provider.on("synced", () => {
        if (contentCache && !type.toJSON()) {
          type.insert(0, contentCache.toString());
        }
      });

      let binding: MonacoBinding;
      if (typeof window !== "undefined") {
        binding = new MonacoBinding(
          type,
          editorRef.getModel()!,
          new Set([editorRef]),
          awareness,
        );
      }

      return () => {
        ydoc.destroy();
        binding?.destroy();
        awareness?.destroy();
      };
    }
  }, [
    editorRef,
    contentCache,
    provider,
    provider?.awareness,
    provider?.document,
    mounted,
  ]);

  return (
    <>
      <Editor
        height="80vh"
        path={meta.path.join("/")}
        onMount={handleOnMount}
        theme={theme === "dark" ? "vs-dark" : "vs"}
        onChange={(value) => setContentCache(value)}
        {...editorProps}
      />
      <Cursors provider={provider} />
    </>
  );
};
