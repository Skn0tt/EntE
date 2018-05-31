FROM node:9
WORKDIR /usr/src/app

RUN yarn global add nodemon

ADD package.json yarn.lock tsconfig.json lerna.json ./
ADD packages/api/package.json ./packages/api/
ADD packages/types/package.json ./packages/types/
ADD packages/mail/package.json ./packages/mail/
ADD packages/validator/package.json ./packages/validator/
ADD packages/db/package.json ./packages/db/

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

COPY packages/api ./packages/api
COPY packages/types ./packages/types
COPY packages/mail ./packages/mail
COPY packages/validator ./packages/validator
COPY packages/db ./packages/db

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

EXPOSE 3000
CMD [ "yarn", "--cwd", "packages/api", "start" ]
