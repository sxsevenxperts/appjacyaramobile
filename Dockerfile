FROM node:18-alpine

WORKDIR /app

# Criar package.json mínimo apenas com express
RUN echo '{"name":"jacyara-web","version":"1.0.0","dependencies":{"express":"^4.18.2"}}' > package.json

# Instalar apenas express
RUN npm install --production

# Copiar servidor e arquivos públicos
COPY web-server.js .
COPY public/ ./public/

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1

# Iniciar servidor
CMD ["node", "web-server.js"]
