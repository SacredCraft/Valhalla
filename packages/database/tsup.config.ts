import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/*"],
  format: "esm",
  dts: true,
  ...options,
}));
