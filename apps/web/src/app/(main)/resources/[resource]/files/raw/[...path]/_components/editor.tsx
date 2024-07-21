"use client";

import { useTheme } from "next-themes";
import React, { useEffect } from "react";

import { api } from "@/trpc/react";
import {
  EditorProps,
  Monaco,
  Editor as MonacoEditor,
  useMonaco,
} from "@monaco-editor/react";

export const Editor = (editorProps: EditorProps) => {
  const monaco = useMonaco();
  const { theme } = useTheme();
  const [count, setCount] = React.useState(0);
  const enter = api.viewFiles.enter.useMutation();

  api.viewFiles.users.useSubscription(undefined, {
    onData: (data) => {
      setCount(data.length);
    },
  });

  useEffect(() => {
    enter.mutate();
  }, []);

  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
      monaco.editor.getEditors().forEach((editor) => {
        console.log("editor instance:", editor.getValue());
      });
    }
  }, [monaco]);

  const beforeMount = (monaco: Monaco) => {
    console.log("beforeMount");
  };

  return (
    <MonacoEditor
      beforeMount={beforeMount}
      value={String(count)}
      height="calc(100vh - 6rem)"
      theme={theme === "dark" ? "vs-dark" : "vs"}
      {...editorProps}
    />
  );
};
