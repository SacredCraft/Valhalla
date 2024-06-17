"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useEditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { setConfigurationJson } from "@/lib/core";
import {
  convertConfigurationToJson,
  convertJsonToConfiguration,
  getContent,
} from "@/lib/core-utils";
import { yaml } from "@codemirror/lang-yaml";
import type { ViewUpdate } from "@codemirror/view";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

export function Raw() {
  const { form, setSubmitCallbacks } = useEditorContext();
  const { configuration, setConfiguration, pluginPath, filePath } =
    useEditorContext();
  const realPath = useMemo(
    () => [pluginPath || "", ...(filePath ?? [])],
    [filePath, pluginPath],
  );
  const [modified, setModified] = useState(false);

  const [value, setValue] = useState(
    convertJsonToConfiguration(configuration?.name!!, configuration?.content),
  );

  const onChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
    setValue(val);
    setModified(true);
  }, []);

  const onSubmit = useCallback(() => {
    if (form) {
      const cache = convertConfigurationToJson(configuration?.name!!, value);
      const content = getContent(cache);
      setConfiguration?.((prev) => ({
        ...prev,
        content,
        cache,
      }));
      setConfigurationJson(realPath, cache, content).then(() => {
        toast.success("Saved successfully");
        setModified(false);
      });
    }
  }, [form, configuration?.name, value, setConfiguration, realPath]);

  useEffect(() => {
    setSubmitCallbacks?.((prev) => prev.set("raw", onSubmit));
  }, [onSubmit, setSubmitCallbacks]);

  return (
    <CodeMirror
      value={value}
      className="w-full"
      theme={vscodeLight}
      extensions={[yaml()]}
      onChange={onChange}
    />
  );
}
