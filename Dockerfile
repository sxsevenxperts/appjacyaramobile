FROM node:18-alpine
WORKDIR /app
RUN npm init -y && npm install express@4.18.2 --save --production
COPY server.js .
COPY public/ ./public/
EXPOSE 3000
CMD ["node", "server.js"]
