FROM node as build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM node
COPY --from=build /usr/src/app/dist ./
COPY package.json yarn.lock ./

RUN yarn install --production

RUN yarn global add nodemon

EXPOSE 80
CMD ['yarn', 'start']