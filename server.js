/**
 * Minimal HTTP server so you can open this project in a browser.
 * Loads Mongoose setup from myApp.js (same schema, connection, helpers).
 */

require('./myApp');

const http = require('http');
const mongoose = require('mongoose');

const PORT = Number(process.env.PORT) || 3000;

const READY_LABELS = ['disconnected', 'connected', 'connecting', 'disconnecting'];

function connectionLabel() {
  const code = mongoose.connection.readyState;
  return READY_LABELS[code] !== undefined ? READY_LABELS[code] : String(code);
}

const server = http.createServer(function (req, res) {
  if (req.url !== '/' && req.url !== '/index.html') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const uriSet = Boolean(process.env.MONGO_URI);
  const html =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8" />\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    '  <title>Mongoose Checkpoint</title>\n' +
    '  <style>\n' +
    '    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }\n' +
    '    code { background: #f4f4f4; padding: 0.15rem 0.35rem; border-radius: 4px; }\n' +
    '    .ok { color: #0a7a2d; } .warn { color: #b35900; }\n' +
    '  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '  <h1>Mongoose Checkpoint</h1>\n' +
    '  <p>This page is served by <code>server.js</code>. Your checkpoint logic lives in <code>myApp.js</code>.</p>\n' +
    '  <p><strong>MongoDB connection:</strong> <span class="' +
    (mongoose.connection.readyState === 1 ? 'ok' : 'warn') +
    '">' +
    connectionLabel() +
    '</span></p>\n' +
    '  <p><strong>MONGO_URI in .env:</strong> ' +
    (uriSet ? '<span class="ok">set</span>' : '<span class="warn">missing — add it for Atlas</span>') +
    '</p>\n' +
    '  <p>Open the terminal running <code>npm start</code> to see connection errors (if any).</p>\n' +
    '</body>\n' +
    '</html>\n';

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, function () {
  console.log('Mongoose checkpoint web UI: http://localhost:' + PORT);
});
