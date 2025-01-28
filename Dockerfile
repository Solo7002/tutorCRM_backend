FROM node:alpine

WORKDIR /tutor-crm-backend  

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "start"]