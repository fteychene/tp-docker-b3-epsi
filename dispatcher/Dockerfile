FROM node:6-slim

ENV REDIS_HOST "redis"
ENV WORKER_URL "http://worker:3000"
ENV CACHE "/var/dispatcher/cache.json"

VOLUME /var/dispatcher/cache.json

WORKDIR /app
ADD package.json ./
RUN npm install

EXPOSE 3000

ADD src src
CMD ["node", "src/dispatcher.js"]