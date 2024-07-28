import useTheme from "next-theme";

import {
  DiffEditor,
  DiffEditorProps,
  Editor,
  EditorProps,
  MonacoDiffEditor,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/providers";

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
  const { content, contentCache, setContentCache, meta } =
    useResourceFileContext();

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
      original={content?.toString()}
      modified={contentCache?.toString()}
      height="calc(100vh - 6rem)"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      onMount={handleEditorDidMount}
      {...diffEditorProps}
    />
  );
};
