import dynamic from "next/dynamic";

import { Suspense, lazy } from "react";

export const HighLighter = dynamic(
  () =>
    import("./shiki").then((mod) => ({
      default: mod.ShikiHighLighter,
    })),
  {
    ssr: false,
  },
);
