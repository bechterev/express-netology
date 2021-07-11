FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY middleware/ ./middleware
COPY models/ ./models
COPY public/ ./public
COPY Routes/ ./Routes
COPY views/ ./views
copy index.js ./
copy README.md ./

CMD ["npm", "start"]