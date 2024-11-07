import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

export default {
  input: "shared-component/src/index.ts",
  output: {
    file: "shared-component/dist/my-components.js",
    format: "umd",
    name: "MyComponents",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
  external: ["react", "react-dom"],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.app.json" }), // Ensure this points to your tsconfig.app.json
    terser(),
  ],
};
