import { redirect } from "next/navigation";

type Props = {
  params: {
    resource: string;
  };
};

export default function ResourcePage({ params: { resource } }: Props) {
  redirect(`/resources/${resource}/browser`);
}
