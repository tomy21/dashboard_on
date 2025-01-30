# Menggunakan image Node.js dari Alpine Linux sebagai base image
FROM node:20-alpine

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan yarn.lock ke dalam direktori kerja
COPY package.json yarn.lock ./

# Menginstall dependencies aplikasi menggunakan Yarn
RUN yarn install

# Menyalin sisa file aplikasi ke dalam direktori kerja
COPY . .

# Membangun aplikasi React untuk produksi
RUN yarn build

# Menginstall global dependency untuk serve
RUN yarn global add serve

# Mengekspos port yang akan digunakan
EXPOSE 4001

# Menetapkan perintah untuk menjalankan aplikasi di dalam container
CMD ["serve", "-s", "build"]
