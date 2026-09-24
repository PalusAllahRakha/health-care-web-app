import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Parent Desktop/package-lock.json was stealing Turbopack's workspace root,
  // which breaks the React Client Manifest for routes like /mfa.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
