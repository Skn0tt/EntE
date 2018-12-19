const mb = 1024 * 1024;

module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{png,ico,html,js,svg,woff2,woff,css,webmanifest}"],
  swDest: "dist/sw.js",
  navigateFallback: "/index.html",
  maximumFileSizeToCacheInBytes: 4 * mb
};
