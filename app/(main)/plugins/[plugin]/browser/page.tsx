import { redirect } from "next/navigation";

type BrowserProps = {
  params: {
    plugin: string;
  };
};

export default function Browser({ params: { plugin } }: BrowserProps) {
  redirect(`/plugins/${plugin}/browser/explore`);
}
