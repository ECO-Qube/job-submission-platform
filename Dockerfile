FROM node:18 as builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install --immutable
RUN yarn build

FROM node:18 as express

WORKDIR /usr/src/app
RUN yarn add express@4.18.2

FROM gcr.io/distroless/nodejs18 as app

COPY --from=builder /usr/src/app/server.js /
COPY --from=builder /usr/src/app/build /server

COPY --from=express /usr/src/app/node_modules /node_modules

EXPOSE 8080
CMD ["server.js"]