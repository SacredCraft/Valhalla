import { useEffect } from "react";

import { useResourceFileContext } from "../essential/providers";
import { ResourceRefresh } from "./resource-refresh";
import { ResourceSave } from "./resource-save";
import { ResourceVersions } from "./resource-versions";
import { ResourceVersionsStatus } from "./resource-versions-status";

export const ResourceEditorLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setRightActions, setLeftActions } = useResourceFileContext();

  useEffect(() => {
    setRightActions(
      <>
        <ResourceVersions />
        <ResourceRefresh />
        <ResourceSave />
      </>,
    );
    setLeftActions(
      <>
        <ResourceVersionsStatus />
      </>,
    );
  }, [setRightActions]);

  return <>{children}</>;
};
