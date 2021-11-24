FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install -g npm@8.1.3
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]