import { redirect } from "next/navigation";

type Props = {
  params: {
    plugin: string;
  };
};

export default function Plugin({ params: { plugin } }: Props) {
  redirect(`/${plugin}/files`);
}
