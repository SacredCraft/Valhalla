import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  target: "es2022",
  banner: { js: '"use client";' },
  ...options,
}));
