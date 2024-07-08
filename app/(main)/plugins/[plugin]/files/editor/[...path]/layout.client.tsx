"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useFilesContext } from "@/app/(main)/plugins/[plugin]/files/layout.client";
import { usePluginContext } from "@/app/(main)/plugins/[plugin]/layout.client";
import { ValhallaFile } from "@/app/actions";
import { ConfigurationResult, setConfigurationJson } from "@/lib/core";
import { getContent } from "@/lib/core-utils";

import { Form } from "@/components/ui/form";

type ContextType = {
  form: ReturnType<typeof useForm>;
  file: ValhallaFile;
  configuration: ConfigurationResult;
  setConfiguration: (configuration: ConfigurationResult) => void;
  modified: boolean;
  setModified: (modified: boolean) => void;
};

const FilesEditorContext = createContext<ContextType | undefined>(undefined);

export const useFilesEditorContext = () => {
  const context = useContext(FilesEditorContext);
  if (!context) {
    throw new Error(
      "useFilesEditorContext must be used within an FilesEditorProvider",
    );
  }
  return context;
};

type FilesEditorClientLayoutProps = {
  file: ValhallaFile;
  children?: React.ReactNode;
  configuration: ConfigurationResult;
  relativePath: string[];
};

export default function FilesEditorClientLayout({
  file,
  children,
  relativePath,
  configuration: initialConfiguration,
}: FilesEditorClientLayoutProps) {
  const { plugin } = usePluginContext();
  const { setRelativePath } = useFilesContext();
  const [configuration, setConfiguration] = useState(initialConfiguration);
  const [modified, setModified] = useState(false);
  const values = useMemo(() => configuration.cache, [configuration]);

  const form = useForm({
    values,
  });

  const { watch } = form;

  useEffect(() => {
    setRelativePath?.(relativePath.map((i) => decodeURIComponent(i)));
  }, [relativePath, setRelativePath]);

  useEffect(() => {
    const subscription = watch(() => {
      setModified(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleSubmit = (values: any) => {
    const content = getContent(values);
    setConfigurationJson(plugin.id, relativePath, values, content).then(() => {
      setModified(false);
    });
  };

  return (
    <FilesEditorContext.Provider
      value={{
        form,
        file,
        configuration,
        setConfiguration,
        modified,
        setModified,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>{children}</form>
      </Form>
    </FilesEditorContext.Provider>
  );
}
