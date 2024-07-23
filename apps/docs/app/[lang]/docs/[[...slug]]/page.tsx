import { DocsBody, DocsPage } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLanguages, getPage } from "@/utils/source";

export default async function Page({
  params,
}: {
  params: { lang: string; slug?: string[] };
}) {
  const page = getPage(params.slug, params.lang);

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

export async function generateStaticParams() {
  return getLanguages().flatMap(({ language, pages }) =>
    pages.map((page) => ({
      lang: language,
      slug: page.slugs,
    })),
  );
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; slug?: string[] };
}) {
  const page = getPage(params.slug, params.lang);

  if (page == null) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
