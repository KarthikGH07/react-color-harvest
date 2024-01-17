import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json" assert { type: "json" };

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
};

const ensureArray = (maybeArr) =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const createConfig = ({ output, min = false, env } = {}) => ({
  input: "src/index.js",
  output: ensureArray(output).map((format) =>
    Object.assign({}, format, {
      name: "ReactColorHarvest",
      exports: "named",
      globals: {
        react: "React",
        "node-vibrant": "Vibrant",
      },
    })
  ),
  external: makeExternalPredicate([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),
  plugins: [
    filesize(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    env &&
      replace({
        "process.env.NODE_ENV": JSON.stringify(env),
        preventAssignment: true,
      }),
    min && terser(),
  ].filter(Boolean),
});

export default [
  createConfig({
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
  }),
  createConfig({
    output: { file: pkg.unpkg, format: "umd" },
    env: "production",
    min: true,
  }),
];
