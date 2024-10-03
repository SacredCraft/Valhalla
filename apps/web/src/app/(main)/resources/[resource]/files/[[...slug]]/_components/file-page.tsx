import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { ReactNode, useEffect, useMemo, useState } from "react";

import valhallaConfig from "@/config";
import { api } from "@/trpc/react";
import {
  FileMeta,
  Resource,
  Template,
  getTemplateByPath,
} from "@sacred-craft/valhalla-resource";
import {
  ResourceFileProvider,
  ResourceVersionsProvider,
  Room,
  TemplateLocked,
} from "@sacred-craft/valhalla-resource-components";

import { useResourceContext } from "../layout.client";
import { FilesHeader } from "./files-header";
import { FilesTabs } from "./files-tabs";

export type FilePageProps = {
  relativePath: string[];
};

export const FilePage = ({ relativePath }: FilePageProps) => {
  const [type, setType] = useQueryState("type");
  const { resource } = useResourceContext();
  const router = useRouter();

  const { data: meta, refetch: refetchMeta } =
    api.files.getResourceFile.useQuery({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
    });

  if (!meta || meta.type === "dir") {
    return null;
  }

  const template = getTemplateByPath(meta.path, resource, valhallaConfig);

  if (!template) {
    return <div>Template not found</div>;
  }

  const renders = template.options?.render;

  if (!renders || renders.length === 0) {
    router.push(`/resources/${resource.name}`);
    return null;
  }

  if (!type || !renders.some((item) => item.value.includes(type))) {
    setType(renders[0].value);
    return null;
  }

  return (
    <ContentLayer
      template={template}
      resource={resource}
      relativePath={relativePath}
      meta={meta}
      refetchMeta={refetchMeta}
      type={type}
    />
  );
};

const ContentLayer = ({
  template,
  resource,
  relativePath,
  meta,
  refetchMeta,
  type,
}: {
  template: Template;
  resource: Resource;
  relativePath: string[];
  meta: FileMeta;
  type: string;
  refetchMeta: () => Promise<any>;
}) => {
  const { data: content, refetch: refetchContent } =
    api.files.readResourceFile.useQuery({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
      options: template?.filesOptions?.read as unknown as any,
    });

  const refresh = async () => {
    const { data: newVersions } = await refetchVersions();
    await refetchContent();
    await refetchMeta();
    setCurrentVersion(newVersions?.[0]?.version);
  };

  const writeResourceFile = api.files.writeResourceFile.useMutation({
    onSuccess: () => {
      refresh();
    },
  });

  const setContent = (
    // eslint-disable-next-line no-undef
    content: string | NodeJS.ArrayBufferView,
    comment?: string,
  ) => {
    return new Promise<"success" | "not-found" | "error">((resolve) => {
      writeResourceFile.mutate(
        {
          resource: resource.name,
          relativePath: relativePath.map((i) => decodeURIComponent(i)),
          content,
          comment,
          options: template?.filesOptions?.write,
          version: versions?.[0]?.version,
        },
        {
          onSuccess: () => {
            resolve("success");
          },
          onError: (error) => {
            if (error.data?.code === "NOT_FOUND") {
              resolve("not-found");
            } else {
              resolve("error");
            }
          },
        },
      );
    });
  };

  const { data: versions, refetch: refetchVersions } =
    api.files.getFileVersions.useQuery(
      {
        resource: resource.name,
        relativePath: relativePath.map((i) => decodeURIComponent(i)),
      },
      {
        refetchInterval: 2000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
      },
    );

  const [currentVersion, setCurrentVersion] = useState<
    string | [string, string]
  >();

  useEffect(() => {
    if (!currentVersion && versions?.length) {
      setCurrentVersion(versions[0]?.version);
    }
  }, [currentVersion, versions]);

  useEffect(() => {
    if (currentVersion) {
      refetchContent();
      refetchMeta();
    }
  }, [currentVersion]);

  const readResourceFileVersion = (version: string) =>
    api.files.readResourceFileVersion.useQuery({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
      version,
      options: template?.filesOptions?.read as unknown as any,
    });

  const latestVersion = useMemo(() => versions?.[0], [versions]);

  const isLatestVersion = latestVersion?.version === currentVersion ?? true;

  const [contentCache, setContentCache] = useState(content);
  const isModified = content !== contentCache;
  const [leftActions, setLeftActions] = useState<ReactNode>(null);
  const [rightActions, setRightActions] = useState<ReactNode>(null);
  const [headerActions, setHeaderActions] = useState<ReactNode>(null);
  const [locked, setLocked] = useState<boolean>(false);

  useEffect(() => {
    if (content) {
      setContentCache(content);
    }
  }, [content]);

  const Component = template.options?.render?.find(
    (item) => item.value === type,
  )?.component;

  const children = Component ? () => <Component /> : null;

  const renders = template.options?.render;
  const currentRender = renders?.find((item) => item.value === type);

  useEffect(() => {
    if (
      renders &&
      renders.some((item) => item.lockOthersWhenCollaboration === true)
    ) {
      const lockedPage = renders.find(
        (item) => item.lockOthersWhenCollaboration,
      );

      // TODO
      if (lockedPage && lockedPage !== currentRender) {
        setLocked(true);
      }
    }
  }, [currentRender, type]);

  let body: React.ReactNode = null;

  if (!currentRender) {
    return null;
  }

  if (template.enableCollaboration) {
    body = <Room>{children && children()}</Room>;
  } else {
    body = children && children();
  }

  return (
    <ResourceFileProvider
      value={{
        setLocked,
        render: currentRender,
        config: valhallaConfig,
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
        headerActions,
        setHeaderActions,
        refresh,
        refetchMeta,
        refetchContent,
      }}
    >
      <ResourceVersionsProvider
        value={{
          readResourceFileVersion,
          latestVersion,
          isLatestVersion,
          versions: versions || [],
          refetchVersions,
          currentVersion,
          setCurrentVersion,
        }}
      >
        <FilesHeader headerActions={headerActions} />
        <FilesTabs left={leftActions} right={rightActions} />
        {locked ? <TemplateLocked /> : body}
      </ResourceVersionsProvider>
    </ResourceFileProvider>
  );
};
