import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultComponents from "fumadocs-ui/mdx";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { utils } from "@/app/source";

interface Param {
  slug: string[];
}

export default async function Page({ params }: { params: Param }) {
  const page = utils.getPage(params.slug);

  if (page == null) {
    notFound();
  }

  return (
    <DocsPage toc={page.data.toc} lastUpdate={page.data.lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <page.data.body
          components={{
            ...defaultComponents,
            Tab,
            Tabs,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): Param[] {
  return utils.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: Param }) {
  const page = utils.getPage(params.slug);

  if (page == null) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
