# Build Static Files
FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Host Static Files
FROM z720/docker-nginx-amplify as server

# Copy over static content
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Copy Nginx Config
COPY react.nginx.conf /etc/nginx/conf.d/app.conf.template

# Amplify
ENV API_KEY ca4e2488d58ecdf4781177d40ac8e99f
ENV AMPLIFY_IMAGENAME EntschuldigungsVerfahren-UI

# Run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
