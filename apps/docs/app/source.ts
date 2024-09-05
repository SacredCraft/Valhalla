import type { InferMetaType, InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

import { docs, meta } from "@/.source";

export const utils = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, meta),
});

export type Page = InferPageType<typeof utils>;
export type Meta = InferMetaType<typeof utils>;
