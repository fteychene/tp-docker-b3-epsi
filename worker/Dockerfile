FROM node:6-slim

WORKDIR /app
ADD package.json ./
RUN npm install
ADD worker.js worker.js

CMD ["node", "worker.js"]