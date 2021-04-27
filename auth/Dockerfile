FROM node:alpine

WORKDIR /app
COPY packade.json .
RUN npm install 
COPY . .

CMD ["npm","start"]
