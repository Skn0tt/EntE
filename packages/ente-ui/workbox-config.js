module.exports = {
  globDirectory: "dist/",
  globPatterns: ["*.{html,js,css}"],
  swDest: "dist/sw.js",
  globIgnores: ["../workbox-cli-config.js"],
  maximumFileSizeToCacheInBytes: 32 * 1024 * 1024
};
