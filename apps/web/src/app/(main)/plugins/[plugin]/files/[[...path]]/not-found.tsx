"use client";

import { Bird } from "lucide-react";
import { usePathname } from "next/navigation";
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Bird className="h-24 w-24 animate-bounce rounded-full border-2 border-dashed p-4 text-gray-400" />
      <div className="text-center">
        <h1 className="text-2xl">File not found.</h1>
        <p className="text-gray-500">
          Maybe the file was deleted or moved. Try refreshing the page.
        </p>
      </div>
    </div>
  );
}
