"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import valhallaConfig from "@/valhalla";
import {
  FileMeta,
  Resource,
  Template,
  getTemplateByPath,
} from "@sacred-craft/valhalla-resource";
import { ResourceFileProvider } from "@sacred-craft/valhalla-resource-components";

import { useResourceContext } from "../../../layout.client";
import { FilesHeader } from "../../_components/files-header";
import { FilesTabs } from "../../_components/files-tabs";

type FileClientLayoutProps = {
  relativePath: string[];
  meta: FileMeta;
  type: string;
};

export function FileClientLayout({
  relativePath,
  meta,
  type,
}: FileClientLayoutProps) {
  const { resource } = useResourceContext();
  const router = useRouter();

  const template = getTemplateByPath(meta.path, resource, valhallaConfig);

  if (!template) {
    return <div>Template not found</div>;
  }

  const pages = template.options?.render?.map((item) => item.value);

  if (!pages || pages.length === 0) {
    router.push(`/resources/${resource.name}/browser/explore`);
    return null;
  }

  if (pages && !pages.includes(type)) {
    router.push(
      `/resources/${resource.name}/files/${pages[0]}/${relativePath.join("/")}`,
    );
    return null;
  }

  return (
    <ContentLayer
      template={template}
      resource={resource}
      relativePath={relativePath}
      meta={meta}
      type={type}
    />
  );
}

const ContentLayer = ({
  template,
  resource,
  relativePath,
  meta,
  type,
}: {
  template: Template;
  resource: Resource;
  relativePath: string[];
  meta: FileMeta;
  type: string;
}) => {
  const { data: content, refetch } = api.files.readResourceFile.useQuery({
    resource: resource.name,
    relativePath: relativePath.map((i) => decodeURIComponent(i)),
    options: template?.filesOptions?.read as unknown as any,
  });

  const writeResourceFile = api.files.writeResourceFile.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // eslint-disable-next-line no-undef
  const setContent = (content: string | NodeJS.ArrayBufferView) =>
    writeResourceFile.mutate({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
      content,
      options: template?.filesOptions?.write,
    });

  const [contentCache, setContentCache] = useState(content || "");
  const isModified = content !== contentCache;
  const [leftActions, setLeftActions] = useState<React.ReactNode>(null);
  const [rightActions, setRightActions] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (content) {
      setContentCache(content);
    }
  }, [content]);

  const children = template.options?.render?.find(
    (item) => item.value === type,
  )?.component;

  if (!content) {
    return null;
  }

  return (
    <ResourceFileProvider
      value={{
        resource,
        template,
        relativePath,
        meta,
        content,
        setContent,
        contentCache,
        setContentCache,
        isModified,
        leftActions,
        setLeftActions,
        rightActions,
        setRightActions,
      }}
    >
      <FilesHeader />
      <FilesTabs left={leftActions} right={rightActions} />
      {children?.()}
    </ResourceFileProvider>
  );
};
