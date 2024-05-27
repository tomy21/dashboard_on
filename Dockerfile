FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install -D tailwindcss postcss autoprefixer
RUN npm install daisyui
RUN npm install -g npm@latest
RUN npm i
RUN npm ci --only=production

COPY tailwind.config.js /app/

COPY . .

EXPOSE 4001

CMD ["npm", "start"]