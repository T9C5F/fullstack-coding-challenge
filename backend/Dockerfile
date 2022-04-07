FROM node:16-alpine

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production --silent
COPY . .

EXPOSE 3000
USER node
CMD ["node", "server.js"]