# ----- build
FROM node:16-alpine as build

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production --silent
COPY . .

RUN ["yarn", "build"]

# ----- run
FROM nginx:stable-alpine as production
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]