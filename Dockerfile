FROM node:17-alpine

WORKDIR /app

ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm ci

ADD . .
RUN npm run build

CMD ["node", "./dist/main.js"]