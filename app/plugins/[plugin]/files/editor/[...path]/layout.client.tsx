"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ValhallaFile } from "@/app/actions";
import { useFilesContext } from "@/app/plugins/[plugin]/files/layout.client";
import { usePluginContext } from "@/app/plugins/[plugin]/layout.client";
import { ConfigurationResult } from "@/lib/core";

import { Form } from "@/components/ui/form";

type ContextType = {
  form: ReturnType<typeof useForm>;
  file: ValhallaFile;
  configuration: ConfigurationResult;
  setConfiguration: (configuration: ConfigurationResult) => void;
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
  const values = useMemo(() => configuration.cache, [configuration]);

  const form = useForm({
    values,
  });

  useEffect(() => {
    setRelativePath?.(relativePath);
  }, [relativePath, setRelativePath]);

  return (
    <FilesEditorContext.Provider
      value={{
        form,
        file,
        configuration,
        setConfiguration,
      }}
    >
      <Form {...form}>{children}</Form>
    </FilesEditorContext.Provider>
  );
}
