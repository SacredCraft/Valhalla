import { useEffect } from "react";

import {
  ResourceRealtimeMonacoEditor,
  ResourceReset,
  ResourceSave,
  useResourceFileContext,
} from "@sacred-craft/valhalla-resource-components";

export const RealtimeEditor = () => {
  const { setRightActions } = useResourceFileContext();

  useEffect(() => {
    setRightActions(
      <>
        <ResourceReset />
        <ResourceSave />
      </>,
    );
  }, [setRightActions]);

  return <ResourceRealtimeMonacoEditor />;
};
