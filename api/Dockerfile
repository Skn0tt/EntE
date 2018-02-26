FROM node AS build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

FROM node
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

RUN yarn global add nodemon

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

EXPOSE 3000
CMD [ "yarn", "start" ]