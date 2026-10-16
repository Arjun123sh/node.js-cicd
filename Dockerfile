FROM node:22-alpine

WORKDIR /app

COPY index.js /app/
COPY package.json /app/

RUN npm install

EXPOSE 8000

CMD ["node", "index.js"]