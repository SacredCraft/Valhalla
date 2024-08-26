import { useEffect } from "react";

import {
  Node,
  ResourceSave,
  Text,
  useResourceFileContext,
} from "@sacred-craft/valhalla-resource-components";

export const Form = () => {
  const { setRightActions } = useResourceFileContext();

  useEffect(() => {
    setRightActions(<ResourceSave />);
  }, [setRightActions]);

  return (
    <div className="p-2">
      <Node path="name">
        <Text />
      </Node>
    </div>
  );
};
