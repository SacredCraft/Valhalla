import { PluginClientLayout } from "@/app/(main)/plugins/[plugin]/layout.client";

import { Menu } from "@/components/plugin/menu";

type PluginProps = {
  params: {
    plugin: string;
  };
  children: React.ReactNode;
};

export default function PluginLayout({
  children,
  params: { plugin: pluginId },
}: PluginProps) {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <PluginClientLayout pluginId={pluginId}>
        <Menu />
        <div className="flex-1">{children}</div>
      </PluginClientLayout>
    </div>
  );
}
