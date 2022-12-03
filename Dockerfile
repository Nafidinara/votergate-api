FROM node:alpine

RUN mkdir -p /usr/src/api-votergate && chown -R node:node /usr/src/api-votergate

WORKDIR /usr/src/api-votergate

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

#EXPOSE 3000
EXPOSE 8078
