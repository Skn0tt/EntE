FROM node as build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM node
COPY --from=build /usr/src/app/dist ./dist
COPY package.json yarn.lock ./

RUN yarn install --production

RUN yarn global add nodemon

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost/status" ]

EXPOSE 80
CMD [ "yarn", "start" ]