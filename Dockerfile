FROM node:18-alpine

WORKDIR /app

# Instalar apenas express
RUN npm init -y && npm install express@4.18.2 --save --production

# Copiar servidor e arquivos públicos
COPY web-server.js .
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "web-server.js"]
