FROM node:22-alpine
WORKDIR /src/server
COPY package*.json .
RUN npm i
CMD ["npm", "start"]