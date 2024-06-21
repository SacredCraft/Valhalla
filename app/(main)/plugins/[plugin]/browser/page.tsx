import { redirect } from "next/navigation";

type BrowserProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default function Browser({ params: { plugin } }: BrowserProps) {
  redirect(`/plugins/${plugin}/browser/explore`);
}
