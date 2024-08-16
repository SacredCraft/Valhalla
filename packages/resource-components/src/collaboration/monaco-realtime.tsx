"use client";

import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";

import { Editor, type EditorProps } from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";
import { MonacoBasicToolbar } from "./monaco-basic-toolbar";
import { MonacoCursors } from "./monaco-cursor";
import { OnlineAvatars } from "./online-avatars";
import { Room, useRoom } from "./room";

export const ResourceRealtimeMonacoEditor = () => {
  return (
    <Room>
      <ResourceRealtimeMonacoEditorInner />
    </Room>
  );
};

const ResourceRealtimeMonacoEditorInner = ({ ...editorProps }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [mounted, setMounted] = useState(false);
  const { contentCache, setContentCache, meta, setLeftActions } =
    useResourceFileContext();
  const [contentInitialed, setContentInitialed] = useState(false);

  const { provider, user } = useRoom();

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (editorRef) {
      setLeftActions(<MonacoBasicToolbar editor={editorRef} />);
    }
  }, [editorRef]);

  return (
    <>
      {contentInitialed && (
        <Editor
          loading={false}
          height="calc(100vh - 6rem)"
          path={meta.path.join("/")}
          onMount={handleOnMount}
          theme={resolvedTheme === "light" ? "vs" : "vs-dark"}
          onChange={(value) => setContentCache(value)}
          {...editorProps}
        />
      )}
      {!contentInitialed && (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          Loading...
        </div>
      )}
      <MonacoCursors
        provider={provider}
        username={user.username}
        avatar={user.avatar}
      />
      <OnlineAvatars />
    </>
  );
};
