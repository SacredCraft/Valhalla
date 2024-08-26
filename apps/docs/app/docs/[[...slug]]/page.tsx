import { DocsBody, DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPage, getPages } from "@/utils/source";

interface Param {
  slug: string[];
}

export default async function Page({ params }: { params: Param }) {
  const page = getPage(params.slug);

  if (page == null) {
    notFound();
  }

  const MDX = page.data.exports.default;

  return (
    <DocsPage toc={page.data.exports.toc} full={page.data.full}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): Param[] {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: Param }) {
  const page = getPage(params.slug);

  if (page == null) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
