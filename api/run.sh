if $NODE_ENV = 'production'
  then
    yarn start
  else
    yarn global add nodemon
    nodemon ./build
fi