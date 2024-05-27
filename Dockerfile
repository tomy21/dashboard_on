FROM node:18-alpine

WORKDIR /app

COPY public/ /app/public
COPY src/ /app/src
COPY package*.json /app/

#RUN npm install -D tailwindcss postcss autoprefixer
#RUN npm install daisyui
RUN npm install
  #&& npm ci --only=production

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
