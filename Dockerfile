FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -D tailwindcss postcss autoprefixer
RUN npm install daisyui
RUN npm i && npm ci --only=production

COPY . .

EXPOSE 4001

CMD ["npm", "start"]