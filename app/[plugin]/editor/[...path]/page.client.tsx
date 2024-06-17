"use client";

import { Save } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfigurationResult, setConfigurationJson } from "@/lib/core";
import { getContent } from "@/lib/core-utils";

import { Raw } from "@/components/plugin/editor/raw";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ContextType = {
  form: ReturnType<typeof useForm>;
  collapsed: boolean;
  configuration: ConfigurationResult;
  setConfiguration: Dispatch<SetStateAction<ConfigurationResult>>;
  submitCallbacks: Map<string, (values: any) => void>;
  setSubmitCallbacks: Dispatch<
    SetStateAction<Map<string, (values: any) => void>>
  >;
  relations: ConfigurationResult[];
  pluginPath: string;
  filePath: string[];
  pluginId: string;
};

const EditorContext = createContext<ContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorContext");
  }
  return context;
};

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
  const [tabValue, setTabValue] = useState(template ? "edit" : "raw");
  const [collapsed, setCollapsed] = useState(false);
  const [configuration, setConfiguration] =
    useState<ConfigurationResult>(initialConfiguration);
  const [submitCallbacks, setSubmitCallbacks] = useState<
    Map<string, (values: any) => void>
  >(new Map());

  const values = useMemo(() => configuration.cache, [configuration]);

  const form = useForm({
    values,
  });

  function onSubmit(values: any) {
    if (tabValue === "edit") {
      const content = getContent(values);

      setConfiguration((prev) => ({
        ...prev,
        content,
        cache: values,
      }));
      setConfigurationJson(realPath, values, content).then(() => {
        toast.success("Saved successfully");
      });
    } else if (tabValue === "raw") {
      const callback = submitCallbacks.get("raw");
      if (callback) {
        callback(values);
      }
    }
  }

  if (!pluginId || !pluginPath) {
    return <></>;
  }

  return (
    <EditorContext.Provider
      value={{
        form,
        pluginId,
        collapsed,
        configuration,
        setConfiguration,
        relations,
        pluginPath,
        filePath,
        submitCallbacks,
        setSubmitCallbacks,
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
                  {template && <TabsTrigger value="edit">Edit</TabsTrigger>}
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  className="h-7 gap-1"
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  Collapse Tools
                </Button>
                <Button className="h-7 gap-1" size="sm" type="submit">
                  <Save className="h-3.5 w-3.5" />
                  Save Changes In{" "}
                  <span className="font-bold capitalize">{tabValue}</span>
                </Button>
              </div>
            </div>
            {template && (
              <TabsContent
                forceMount
                value="edit"
                className="flex flex-col-reverse gap-4 data-[state=inactive]:hidden md:flex-row w-full"
              >
                <div className="flex-1">{template}</div>
                {info}
              </TabsContent>
            )}
            <TabsContent
              forceMount
              value="raw"
              className="flex md:flex-row flex-col gap-4 data-[state=inactive]:hidden"
            >
              <Raw />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </EditorContext.Provider>
  );
}
