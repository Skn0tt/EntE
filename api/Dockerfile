FROM node
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

RUN yarn global add nodemon

EXPOSE 80
CMD ['yarn', 'start']