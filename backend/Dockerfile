FROM node:23-slim

WORKDIR /app

RUN corepack enable

COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .yarnrc.yml
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --immutable

# Copiar o arquivo app.ts para o diretório src
COPY src/ ./src/

EXPOSE 3001

CMD ["yarn", "dev:watch"]