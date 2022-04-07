import { fileURLToPath } from "url";

import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { createVuePlugin } from "vite-plugin-vue2";
// @ts-ignore
import vueTemplateBabelCompiler from "vue-template-babel-compiler";
import scriptSetup from "unplugin-vue2-script-setup/vite";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    define:
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV !== "production"
        ? {
            global: "window", // for modules that are not browser friendly and depend on "global"
          }
        : {},
    server: {
      port: 8080,
    },
    build: {
      emptyOutDir: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production",
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    plugins: [
      createVuePlugin({
        jsx: true,
        vueTemplateOptions: {
          compiler: vueTemplateBabelCompiler,
        },
      }),
      Components({
        resolvers: [VuetifyResolver()],
      }),
      scriptSetup(),
      legacy(), // uses browserlists from package.json
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  });
};
