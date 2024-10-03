import { FilesPage } from "./_components/files-page";

export default function Page({
  params: { slug, resource },
}: {
  params: { slug: string[]; resource: string };
}) {
  return <FilesPage params={{ slug, resource }} />;
}
