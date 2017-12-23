FROM node
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

ENV NODE_ENV=production
ENV DOCKER=true

EXPOSE 3000
CMD ["yarn", "start"]