module.exports = {
  globDirectory: "dist/",
  globPatterns: ["*.{html,js,css}"],
  swDest: "src/sw.js",
  globIgnores: ["../workbox-cli-config.js"],
  maximumFileSizeToCacheInBytes: 2.5e6
};
