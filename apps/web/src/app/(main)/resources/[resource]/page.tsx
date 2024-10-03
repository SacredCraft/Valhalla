import { redirect } from "next/navigation";

export default function ResourcePage({
  params: { resource },
}: {
  params: { resource: string };
}) {
  redirect(`/resources/${resource}/files`);
}
