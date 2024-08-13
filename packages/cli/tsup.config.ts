import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  target: "esnext",
  banner: {
    js: "#!/usr/bin/env node",
  },
  ...options,
}));
