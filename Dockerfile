FROM node:18-bullseye as build

WORKDIR /dyndns-vue

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM scratch

COPY --from=build /dyndns-vue/dist /dyndns-vue

CMD [""]