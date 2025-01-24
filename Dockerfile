FROM node:alpine

WORKDIR /tutor-crm-backend  

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY .env .env
COPY src ./src
COPY config ./config

EXPOSE ${PORT}

CMD ["npm", "start"]