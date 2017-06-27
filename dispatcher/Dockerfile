FROM node:6-slim

WORKDIR /app
ADD package.json ./
RUN npm install

ADD src src

ENV REDIS_HOST="redis"
ENV REDIS_PORT="6379"
ENV WORKER_URL="http://worker:3000"
ENV CACHE="/var/cache/cache.json"

VOLUME /var/cache


EXPOSE 3000

CMD ["node", "src/dispatcher.js"]