"use client";

import { createTemplate } from "@sacred-craft/valhalla-resource";

import { Form } from "./components/form";
import { RealtimeEditor } from "./components/realtime-editor";

export const commonTemplate = createTemplate({
  name: "Common",
  priority: 1,
  matchedPaths: [
    "*.json$",
    "*.yaml",
    "*.yml",
    "*.toml",
    "*.md",
    "*.txt",
    "*.js",
    "*.ts",
    "*.jsx",
    "*.tsx",
    "*.css",
    "*.scss",
    "*.less",
    "*.html",
    "*.vue",
    "*.svelte",
    "*.astro",
    "*.php",
    "*.py",
    "*.rb",
    "*.go",
    "*.rs",
    "*.swift",
    "*.kt",
    "*.java",
    "*.c",
    "*.cpp",
  ],
  filesOptions: {
    read: "utf-8",
  },
  options: {
    render: [
      {
        component: RealtimeEditor,
        value: "editor",
        label: "RealtimeEditor",
        lockOthersWhenCollaboration: true,
      },
      {
        component: Form,
        value: "form",
        label: "Form",
      },
    ],
  },
});
