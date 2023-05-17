switch (process.env.BABEL_ENV || process.env.NODE_ENV) {
  case "flow":
    module.exports = {
      plugins: [
        "@babel/plugin-syntax-async-generators",
        "@babel/plugin-syntax-class-properties",
        "@babel/plugin-syntax-do-expressions",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-export-default-from",
        "@babel/plugin-syntax-export-namespace-from",
        "@babel/plugin-syntax-flow",
        "@babel/plugin-syntax-object-rest-spread",
        "@babel/plugin-syntax-throw-expressions",
        "@babel/plugin-proposal-function-bind",
      ],
    };
    break;

  case "production":
    module.exports = {
      presets: [["@babel/preset-env", { loose: true }], "@babel/preset-flow"],
    };
    break;

  case "development":
    module.exports = {
      presets: [
        ["@babel/preset-env", { loose: true }],
        "@babel/preset-stage-0",
        "@babel/preset-flow",
      ],
    };
    break;

  case "test":
    module.exports = {
      presets: [
        ["@babel/preset-env", { loose: true }],
        "@babel/preset-stage-0",
        "@babel/preset-flow",
      ],
      plugins: ["@babel/plugin-transform-runtime"],
    };
    break;
}
