FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar arquivos
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["node", "web-server.js"]
