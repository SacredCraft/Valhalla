import { useEffect } from "react";

import {
  ResourceRealtimeMonacoEditor,
  ResourceSave,
  useResourceFileContext,
} from "@sacred-craft/valhalla-resource-components";

export const RealtimeEditor = () => {
  const { setRightActions } = useResourceFileContext();

  useEffect(() => {
    setRightActions(
      <>
        <ResourceSave />
      </>,
    );
  }, [setRightActions]);

  return <ResourceRealtimeMonacoEditor />;
};
