"use client";

import { usePathname } from "next/navigation";

import { Bird } from "lucide-react";
import { useEffect } from "react";

import { usePluginContext } from "../../layout.client";

export default function NotFound() {
  const { setOpenedFiles } = usePluginContext();
  const pathname = usePathname();

  useEffect(() => {
    const keyword = "files/";
    const index = pathname.indexOf(keyword);
    if (index !== -1) {
      const path = pathname.substring(index + keyword.length);
      setOpenedFiles((prev) => {
        if (!prev) return prev;
        return prev.filter((file) => file.path.join("/") !== path);
      });
    }
  }, [pathname, setOpenedFiles]);

  return (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
      <Bird className="w-24 h-24 text-gray-400 animate-bounce border-dashed border-2 rounded-full p-4" />
      <div className="text-center">
        <h1 className="text-2xl">File not found.</h1>
        <p className="text-gray-500">
          Maybe the file was deleted or moved. Try refreshing the page.
        </p>
      </div>
    </div>
  );
}
