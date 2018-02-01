# Build Static Files
FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

# Host Static Files
FROM nginx:alpine as server

# Copy over static content
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Copy Nginx Config
COPY nginx.conf /etc/nginx/nginx.conf

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost/" ]

# Run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
