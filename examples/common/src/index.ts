import { createResource } from "@sacred-craft/valhalla-resource";

import { commonTemplate } from "./templates/common";

export const common = createResource({
  name: "common",
  version: "1.0.0",

  templates: [commonTemplate],
});
