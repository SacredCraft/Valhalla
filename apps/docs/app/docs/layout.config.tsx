import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import { type HomeLayoutProps } from "fumadocs-ui/home-layout";
import { type DocsLayoutProps } from "fumadocs-ui/layout";
import { User, Workflow } from "lucide-react";

import { pageTree } from "@/utils/source";

// shared configuration
export const baseOptions: HomeLayoutProps = {
  nav: {
    title: "Valhalla Docs",
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
  ],
};

// docs layout configuration
export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: pageTree,
  nav: {
    ...baseOptions.nav,
  },
  sidebar: {
    banner: (
      <RootToggle
        options={[
          {
            title: "用户文档",
            description: "学习如何使用 Valhalla",
            url: "/docs/for-users",
            icon: (
              <User className="size-9 shrink-0 rounded-md bg-gradient-to-t from-secondary p-1.5" />
            ),
          },
          {
            title: "开发者文档",
            description: "学习如何开发 Valhalla 资源",
            url: "/docs/for-developers",
            icon: (
              <Workflow className="size-9 shrink-0 rounded-md bg-gradient-to-t from-secondary p-1.5" />
            ),
          },
        ]}
      />
    ),
  },
};
