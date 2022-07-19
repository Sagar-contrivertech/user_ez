FROM node:latest

WORKDIR /index

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 8082

CMD [ "node", "index.js", "npm", "start" ]