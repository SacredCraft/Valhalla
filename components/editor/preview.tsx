"use client";

import { Suspense, useContext } from "react";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";

import { HighLighter } from "@/components/ui/shiki/dynamic";

export function Preview() {
  const { configuration } = useContext(EditorContext);

  return (
    <Suspense
      fallback={
        <pre>
          <code>{configuration?.raw ? configuration?.raw : "Loading..."}</code>
        </pre>
      }
    >
      <HighLighter
        className="h-full flex-1 overflow-auto md:w-1/2 w-full font-mono"
        lang="yaml"
        content={configuration?.raw!!}
      />
      <HighLighter
        className="h-full flex-1 overflow-auto md:w-1/2 w-full font-mono"
        lang="json"
        content={JSON.stringify(JSON.parse(configuration?.content!!), null, 2)}
      />
    </Suspense>
  );
}
