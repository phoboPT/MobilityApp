FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
RUN npm install -g npm@8.1.3
COPY . .

CMD ["npm","start"]
