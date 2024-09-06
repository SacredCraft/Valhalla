import { defineValhallaConfig } from "@sacred-craft/valhalla-config";
import {
  Resource,
  Template,
  createTemplate,
} from "@sacred-craft/valhalla-resource";
import { root, example1, example2 } from "@sacred-craft/valhalla-resource-common";

// 在此注册资源
const resources: Resource[] = [
  root(), 
  example1(), 
  example2()
];

// 全局模板
const globalTemplates: Template[] = [
  createTemplate({
    name: "Image",
    options: {
      browser: {
        onClick: "preview-image",
      },
    },
    matchedPaths: [".*\\.(png|jpe?g|gif|svg)$"],
  }),
];

// 主配置
const valhallaConfig = defineValhallaConfig({
  resources,
  globalTemplates,
  dateOptions: {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  },
});

export default valhallaConfig;
