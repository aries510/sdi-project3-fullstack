FROM node:alpine

COPY . /app

EXPOSE 5173

WORKDIR /app

RUN npm install

CMD [ "npm", "run", "dev" ]