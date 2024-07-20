import { redirect } from "next/navigation";

type BrowserProps = {
  params: {
    resource: string;
  };
};

export default function Browser({ params: { resource } }: BrowserProps) {
  redirect(`/resources/${resource}/browser/explore`);
}
