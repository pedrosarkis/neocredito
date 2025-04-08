FROM node:23-alpine

WORKDIR /app

RUN corepack enable

COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .yarnrc.yml
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --immutable

CMD ["yarn", "dev"]
