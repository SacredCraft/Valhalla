import useTheme from "next-theme";

import {
  EditorProps,
  Editor as MonacoEditor,
} from "@sacred-craft/valhalla-components";

import { useResourceFileContext } from "../essential/layout";

export const ResourceMonacoEditor = (editorProps: EditorProps) => {
  const { theme } = useTheme();
  const { contentCache, setContentCache, meta } = useResourceFileContext();

  const lang = meta.path.join(".").split(".").pop() || "plaintext";

  return (
    <MonacoEditor
      value={contentCache.toString()}
      onChange={(value) => setContentCache(value || "")}
      height="calc(100vh - 6rem)"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      language={lang}
      {...editorProps}
    />
  );
};
