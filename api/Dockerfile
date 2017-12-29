FROM node
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

ENV NODE_ENV=production

EXPOSE 4000
CMD ["yarn", "start"]