FROM node:alpine

RUN mkdir -p /usr/src/api-guru-bintang && chown -R node:node /usr/src/api-guru-bintang

WORKDIR /usr/src/api-guru-bintang

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

#EXPOSE 3000
EXPOSE 8078
