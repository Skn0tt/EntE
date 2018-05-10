
yarn test:e2e:ci
e=$?

sed -i '' -e 's/timestamp=\".*\"//g' e2e.xml

exit $e