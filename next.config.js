const withSvgr = require("next-svgr");
const webpack = require("webpack");
const path = require("path");

module.exports = withSvgr({
  target: "serverless",
  experimental: {
    jsconfigPaths: true,
  },
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    ROTATION_PERIOD: process.env.ROTATION_PERIOD,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: path.resolve(
        __dirname,
        "node_modules/html-minifier/node_modules/uglify-js/tools/node.js"
      ),
      loader: "null-loader",
    });

    // https://github.com/aliksend/bull_webpack_issue/issues/1
    config.module.rules.push({
      test: /node_modules\/bull\/lib\/commands\/index\.js$/,
      use: {
        loader: "string-replace-loader",
        options: {
          search: "__dirname",
          replace: `"${path.dirname(require.resolve("bull"))}/lib/commands"`,
        },
      },
    });

    config.plugins.push(
      new webpack.IgnorePlugin(/.spec.[t|j]sx?/),
      new webpack.IgnorePlugin(/@nestjs\/microservices/),
      new webpack.IgnorePlugin(/@nestjs\/websockets/),
      new webpack.IgnorePlugin(/cache-manager/),
      new webpack.IgnorePlugin(/hiredis/)
    );

    return config;
  },
});
