(cd en && mkdocs build)
(cd de && mkdocs build)

mkdir build build/de build/en
cp -R de/site/* build/
cp -R en/site/* build/en/
cp -R de/site/* build/de/