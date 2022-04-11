FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV JWT_SECRET MyAwesomeSuperSecret
ENV DB_PASSWORD 123456
ENV DB_NAME some_db
ENV DB_USER postgres
ENV DB_HOST host.docker.internal
ENV DB_PORT 5432
COPY package.json /usr/src/app/package.json
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
