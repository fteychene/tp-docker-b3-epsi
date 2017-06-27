FROM node:6-slim

WORKDIR /app
ADD package.json ./
RUN npm install
ENV REDIS_HOST redis
ADD monitor.js monitor.js

ENTRYPOINT ["npm", "run"]
CMD ["monitor"]
