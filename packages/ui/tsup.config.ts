import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.tsx"],
  format: ["esm"],
  dts: true,
  minify: true,
  external: ["react"],
  ...options,
}));
