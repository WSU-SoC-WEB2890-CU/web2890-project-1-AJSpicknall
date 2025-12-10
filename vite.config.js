import path from "path"
import glob from "glob"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"
import eslint from "@rollup/plugin-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const input = {}

glob
  .sync("./src/**/*.html")
  .map((file) => [file.substring(`.${path.sep}src${path.sep}`.length), file])
  .forEach(([key, value]) => {
    input[key] = value
  })

export default defineConfig(({ mode }) => ({
  root: "src",
  build: {
    manifest: true,
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input
    }
  },
  server: {
    port: 8080,
    open: "/"
  },
  plugins: [
    mode !== "production" &&
      {
        ...eslint({
          include: ["src/**/*.js"],
          configFile: path.resolve(__dirname, ".eslintrc.json"),
          throwOnError: false,
          throwOnWarning: false
        }),
        enforce: "pre",
        apply: "serve"
      }
  ].filter(Boolean)
}))
