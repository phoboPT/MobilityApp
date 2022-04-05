FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install -g npm@latest
RUN npm update -g
RUN npm -v
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]
