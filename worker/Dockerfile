FROM node:6-slim

WORKDIR /app
ADD package.json ./
RUN npm install
ENV REDIS_HOST redis
ADD worker.js worker.js

CMD ["node", "worker.js"]
