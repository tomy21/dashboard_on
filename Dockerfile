FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i daisyui
RUN npm run build
RUN npm i
RUN npm ci --only=production

COPY . .

EXPOSE 4001

CMD ["npm", "start"]