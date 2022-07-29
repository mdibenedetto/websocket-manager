const { createServer } = require('http');
const ws = require('ws');

const { renderFile, uuid_v4 } = require('./helpers');
const PORT = 7071;

// ====================================================
// Server and static files
// ====================================================
const server = createServer((req, res) => {
  const STATIC_FOLDER = './client';
  const routeMap = {
    '': `${STATIC_FOLDER}/index.html`,
    'index.js': `${STATIC_FOLDER}/index.js`,
    'style.css': `${STATIC_FOLDER}/style.css`,
  };
  const fileName = req.url.slice(1);
  renderFile(res, routeMap[fileName]);
});

server.listen(PORT);
console.log(`wss up http://localhost:${PORT}`);
// ====================================================
// Websocket
// ====================================================
const wss = new ws.Server({
  noServer: true,
  path: `/my-ws`,
});

// Websocket clients
const clients = new Map();

// Websocket message
function sendMessageToClients(message) {
  [...clients.keys()].forEach((client) => {
    console.log(message);
    client.send(message);
  });
}

// Websocket life cycle
wss.on('connection', (ws) => {
  const id = uuid_v4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);
  sendMessageToClients('welcome');

  ws.on('message', (rawMessage) => {
    const message = rawMessage;
    const metadata = clients.get(ws);

    message.sender = metadata.id;
    message.metadata = metadata;

    sendMessageToClients(`[WS] Received: ${message}`);
  });
});

wss.on('close', () => {
  clients.delete(ws);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
// ====================================================
