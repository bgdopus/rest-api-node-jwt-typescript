FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
