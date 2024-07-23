import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import { type HomeLayoutProps } from "fumadocs-ui/home-layout";
import { type DocsLayoutProps } from "fumadocs-ui/layout";
import { User, Workflow } from "lucide-react";

import { defaultLanguage } from "@/utils/i18n";
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
export const docsOptions = (lang: string): DocsLayoutProps => ({
  ...baseOptions,
  tree: pageTree[lang] ? pageTree[lang] : pageTree[defaultLanguage]!!,
  i18n: true,
  nav: {
    ...baseOptions.nav,
    url: `/${lang}`,
  },
  sidebar: {
    banner: (
      <RootToggle
        options={[
          {
            title: "For Users",
            description: "Documentation for users",
            url: "/docs/for-users",
            icon: (
              <User className="size-9 shrink-0 rounded-md bg-gradient-to-t from-secondary p-1.5" />
            ),
          },
          {
            title: "For Developers",
            description: "Documentation for developers",
            url: "/docs/for-developers",
            icon: (
              <Workflow className="size-9 shrink-0 rounded-md bg-gradient-to-t from-secondary p-1.5" />
            ),
          },
        ]}
      />
    ),
  },
});
