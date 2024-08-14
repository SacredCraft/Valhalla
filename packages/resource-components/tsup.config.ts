import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  target: "esnext",
  banner: {
    js: `"use client";`,
  },
  ...options,
}));
