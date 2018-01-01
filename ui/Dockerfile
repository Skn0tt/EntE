# Build Static Files
FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Host Static Files
FROM nginx:alpine as server

# Copy over static content
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Copy Nginx Config
COPY nginx.conf /etc/nginx/conf.d/app.conf.template

# Run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
