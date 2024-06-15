"use client";

import { Suspense, useContext } from "react";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { convertJsonToConfiguration, mergeObjects } from "@/lib/core-utils";

import { HighLighter } from "@/components/ui/shiki/dynamic";

export function Preview() {
  const { configuration } = useContext(EditorContext);

  return (
    <Suspense
      fallback={
        <pre>
          <code>
            {configuration?.content
              ? convertJsonToConfiguration(
                  configuration?.name!!,
                  configuration?.content!!,
                )
              : "Loading..."}
          </code>
        </pre>
      }
    >
      <HighLighter
        className="h-full flex-1 overflow-auto md:w-1/2 w-full font-mono"
        lang="yaml"
        content={convertJsonToConfiguration(
          configuration?.name!!,
          configuration?.content!!,
        )}
      />
      <HighLighter
        className="h-full flex-1 overflow-auto md:w-1/2 w-full font-mono"
        lang="json"
        content={JSON.stringify(configuration?.cache ?? {}, null, 2)}
      />
    </Suspense>
  );
}
