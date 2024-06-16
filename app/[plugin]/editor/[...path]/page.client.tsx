"use client";

import { Save } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfigurationResult, setConfigurationJson } from "@/lib/core";
import { getContent } from "@/lib/core-utils";

import { Preview } from "@/components/editor/preview";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { OpenInVSC } from "@/components/ui/open-in-vsc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ContextType = {
  form?: ReturnType<typeof useForm>;
  collapsed?: boolean;
  configuration?: ConfigurationResult;
  relations?: ConfigurationResult[];
  saved: boolean;
  pluginPath?: string;
  filePath?: string[];
  pluginId?: string;
};

const EditorContext = createContext<ContextType>({
  saved: true,
});

export const useEditorContext = () => useContext(EditorContext);

type ClientProps = {
  pluginId?: string;
  pluginPath?: string;
  filePath?: string[];
  template?: React.ReactNode;
  info?: React.ReactNode;
  initialConfiguration: ConfigurationResult;
  relations: ConfigurationResult[];
};

export default function Client({
  pluginPath,
  filePath = [],
  template,
  info,
  initialConfiguration,
  relations,
  pluginId,
}: ClientProps) {
  const realPath = useMemo(
    () => [pluginPath || "", ...filePath],
    [filePath, pluginPath],
  );
  const [tabValue, setTabValue] = useState("edit");
  const [collapsed, setCollapsed] = useState(false);
  const [configuration, setConfiguration] =
    useState<ConfigurationResult>(initialConfiguration);

  const values = useMemo(() => configuration.cache, [configuration]);

  const [saved, setSaved] = useState(true);

  const form = useForm({
    values,
  });

  const { watch } = form;

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      setSaved(false);

      const content = getContent(values);

      setConfiguration({
        ...configuration,
        content,
        cache: values,
      });
    });
    return () => unsubscribe();
  }, [configuration, filePath, form, realPath, watch]);

  function onSubmit() {
    setConfigurationJson(
      realPath,
      configuration.cache,
      configuration.content,
    ).then(() => {
      toast.success("Saved successfully");
    });
    setSaved(true);
  }

  return (
    <EditorContext.Provider
      value={{
        form,
        pluginId,
        collapsed,
        configuration,
        saved,
        relations,
        pluginPath,
        filePath,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs
            className="flex h-full flex-col overflow-hidden"
            value={tabValue}
            onValueChange={setTabValue}
          >
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 hidden md:inline-flex"
                  asChild
                >
                  <OpenInVSC path={realPath.join("/")}>Open in VSC</OpenInVSC>
                </Button>
                <Button
                  className="h-7 gap-1"
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  Collapse Tools
                </Button>
                <Button
                  className="h-7 gap-1"
                  size="sm"
                  type="submit"
                  disabled={saved}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
            <TabsContent
              forceMount
              value="edit"
              className="flex flex-col-reverse gap-4 data-[state=inactive]:hidden md:flex-row w-full"
            >
              <div className="flex-1">{template}</div>
              {info}
            </TabsContent>
            <TabsContent
              forceMount
              value="preview"
              className="flex md:flex-row flex-col gap-4 data-[state=inactive]:hidden"
            >
              <Preview />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </EditorContext.Provider>
  );
}
