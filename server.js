const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', ts: new Date().toISOString() }));
    return;
  }

  // Resolve file path
  let filePath = path.join(PUBLIC, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  // Se não tem extensão, é rota SPA -> serve index.html
  if (!ext) filePath = path.join(PUBLIC, 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback para index.html (SPA)
      fs.readFile(path.join(PUBLIC, 'index.html'), (err2, html) => {
        if (err2) {
          res.writeHead(500);
          res.end('Erro interno');
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(html);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Easy Shedulle server running on port ${PORT}`);
});
