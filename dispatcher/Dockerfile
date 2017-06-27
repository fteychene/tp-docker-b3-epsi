FROM node:6-slim

EXPOSE 3000

ENV REDIS_HOST redis
ENV REDIS_PORT 6379
ENV WORKER_URL http://worker:3000

WORKDIR /app
ADD package.json ./
RUN npm install

ADD src src

CMD ["node", "src/dispatcher.js"]