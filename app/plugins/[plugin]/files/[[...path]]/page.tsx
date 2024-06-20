import { redirect } from "next/navigation";

type BrowserProps = {
  params: {
    plugin: string;
    path?: string[];
  };
  children: React.ReactNode;
};

export default function Browser({ params: { plugin, path } }: BrowserProps) {
  if (!path) {
    redirect(`/plugins/${plugin}/browser/explore`);
  }
  redirect(`/plugins/${plugin}/files/info/${path.join("/")}`);
}
