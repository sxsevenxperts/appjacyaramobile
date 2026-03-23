const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Servir arquivos estáticos SEM cache para garantir versão mais recente
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', version: '2.0.0', timestamp: new Date().toISOString() });
});

// SPA fallback — qualquer rota devolve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Easy Shedulle server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});
