import { redirect } from "next/navigation";

type Props = {
  params: {
    plugin: string;
  };
};

export default function PluginPage({ params: { plugin } }: Props) {
  redirect(`/plugins/${plugin}/browser`);
}
