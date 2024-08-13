import { useTheme } from "next-themes";
import { useEffect } from "react";

import {
  DiffEditor,
  DiffEditorProps,
  Editor,
  EditorProps,
  MonacoDiffEditor,
} from "@sacred-craft/valhalla-components";

import {
  useResourceFileContext,
  useResourceVersionsContext,
} from "../essential/providers";

export const ResourceRealtimeMonacoEditor = (editorProps: EditorProps) => {
  const { theme } = useTheme();
  const { contentCache, setContentCache, meta } = useResourceFileContext();

  return (
    <Editor
      value={contentCache?.toString()}
      onChange={(value) => setContentCache(value || "")}
      height="calc(100vh - 6rem)"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      path={meta.path.join("/")}
      {...editorProps}
    />
  );
};

export const ResourceMonacoEditor = (editorProps: EditorProps) => {
  const { theme } = useTheme();
  const { contentCache, setContentCache, meta } = useResourceFileContext();

  return (
    <Editor
      value={contentCache?.toString()}
      onChange={(value) => setContentCache(value || "")}
      height="calc(100vh - 6rem)"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      path={meta.path.join("/")}
      {...editorProps}
    />
  );
};

export const ResourceMonacoDiffEditor = (diffEditorProps: DiffEditorProps) => {
  const { theme } = useTheme();
  const { contentCache, setContentCache, meta } = useResourceFileContext();

  const { currentVersion, readResourceFileVersion } =
    useResourceVersionsContext();

  if (!currentVersion) {
    return null;
  }

  const { data: modified } = readResourceFileVersion(currentVersion[1]);

  const { data: readonly } = readResourceFileVersion(currentVersion[0]);

  useEffect(() => {
    setContentCache(modified?.content);
  }, []);

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editor.onDidUpdateDiff(() => {
      const modifiedModel = editor.getModifiedEditor().getModel();
      if (modifiedModel) {
        setContentCache(modifiedModel.getValue());
      }
    });
  };

  return (
    <DiffEditor
      originalModelPath={meta.path.join("/")}
      modifiedModelPath={meta.path.join("/")}
      original={readonly?.content?.toString()}
      modified={contentCache?.toString()}
      height="calc(100vh - 6rem)"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      onMount={handleEditorDidMount}
      {...diffEditorProps}
    />
  );
};
