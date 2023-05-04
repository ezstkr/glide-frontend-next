/**
 * Rollup 설정 모듈
 *
 * @author RWB
 * @since 2022.06.06 Mon 17:44:31
 */
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from '@rollup/plugin-node-resolve';

const extensions = ["js", "jsx", "ts", "tsx"];
const pkg = require("./package.json");
const config = [
  {
    external: ['react', 'react-dom'],
    input: "./src/react-chat-bot.ts",
    output: {
      file: './dist/react-chat-bot.js',
      // dir: './dist',
      format: "es",
      // preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      nodeResolve({extensions}),
      babel({
        exclude: "node_modules/**",
        extensions,
        include: ["src/**/*"],
        babelHelpers: 'bundled',
      }),
      commonjs({include: "node_modules/**"}),
      peerDepsExternal(),
      typescript({tsconfig: "./tsconfig.json"}),
      postcss({
        extract: false,
        inject: (cssVariableName) =>
          `import styleInject from 'style-inject';styleInject(${cssVariableName});`,
        modules: true,
        sourceMap: false,
        use: ["sass"],
      }),
    ],
  },
];
export default config;
