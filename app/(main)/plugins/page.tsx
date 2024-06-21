import { redirect } from "next/navigation";

import { plugins } from "@/config/plugins";

export default function PluginsPage() {
  redirect(`/plugins/${plugins[0].id}`);
}
