FROM node:6-slim

WORKDIR /app
ADD package.json ./
RUN npm install
ADD monitor.js monitor.js

ENTRYPOINT ["npm", "run"]
CMD ["monitor"]