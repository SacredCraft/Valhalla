import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  target: "node18",
  banner: {
    js: "#!/usr/bin/env node",
  },
  ...options,
}));
