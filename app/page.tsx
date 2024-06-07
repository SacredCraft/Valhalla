import { redirect } from "next/navigation";

import { plugins } from "@/config/plugins";

export default function Home() {
  return redirect(`/${plugins[0].id}`);
}
