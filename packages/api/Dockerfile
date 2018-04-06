FROM node
WORKDIR /usr/src/app

RUN yarn global add nodemon

COPY package.json yarn.lock tsconfig.json lerna.json ./

COPY packages/api ./packages/api
COPY packages/types ./packages/types
COPY packages/mail ./packages/mail
COPY packages/validator ./packages/validator

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

EXPOSE 3000
CMD [ "yarn", "--cwd", "packages/api", "start" ]
