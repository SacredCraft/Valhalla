import { createResource } from "@sacred-craft/valhalla-resource";
import { commonTemplate } from "./templates/common";

// 在此创建资源
export const root = createResource({
  name: "root",
  version: "1.0.0",
  templates: [commonTemplate],
});

export const example1 = createResource({
  name: "example1",
  version: "1.0.0",
  templates: [commonTemplate],
});

export const example2 = createResource({
  name: "example2",
  version: "1.0.0",
  templates: [commonTemplate],
});