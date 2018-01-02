FROM node
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

RUN chmod +x ./run.sh

EXPOSE 80
CMD ./run.sh