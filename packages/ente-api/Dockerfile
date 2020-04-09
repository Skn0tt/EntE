FROM node:10
WORKDIR /usr/src/app

ADD packages/ente-api/entrypoint.sh ./

ADD package.json yarn.lock tsconfig.json lerna.json patches ./
ADD packages/ente-api/package.json ./packages/ente-api/package.json
ADD packages/ente-api/tsconfig.json ./packages/ente-api/tsconfig.json
ADD packages/ente-types/package.json ./packages/ente-types/package.json

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

ADD packages/ente-api ./packages/ente-api
ADD packages/ente-types ./packages/ente-types

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

EXPOSE 3000
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
CMD [ "yarn", "--cwd", "packages/ente-api", "start" ]
