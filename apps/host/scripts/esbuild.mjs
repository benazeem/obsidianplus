// scripts/build-all.ts
import { build as buildElectron } from "esbuild";

await buildElectron({
  entryPoints: ["src/electron/main.ts"],
  outfile: "dist/electron.js",
  format: "cjs",
  platform: "node",
  target: ["esnext"],
  bundle: true,
  external: ["electron", "ws", "sharp", "onnxruntime-node", "*.node"],
});
