const express = require('express');
const http = require('http');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// 房間資料只存喺記憶體：room name -> { clients, history }
const rooms = new Map();
const HISTORY_LIMIT = 500;

function getRoom(name) {
  if (!rooms.has(name)) {
    rooms.set(name, { clients: new Set(), history: [] });
  }
  return rooms.get(name);
}

function broadcast(room, msg, except) {
  const data = JSON.stringify(msg);
  for (const client of room.clients) {
    if (client !== except && client.readyState === client.OPEN) {
      client.send(data);
    }
  }
}

function presence(room) {
  broadcast(room, { type: 'presence', count: room.clients.size });
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'join') {
      const name = String(msg.room || '').trim().slice(0, 64);
      if (!name) return;
      if (ws.roomName) {
        const old = rooms.get(ws.roomName);
        if (old) { old.clients.delete(ws); presence(old); }
      }
      ws.roomName = name;
      const room = getRoom(name);
      room.clients.add(ws);
      ws.send(JSON.stringify({ type: 'history', items: room.history, count: room.clients.size }));
      presence(room);
      return;
    }

    if (!ws.roomName) return;
    const room = rooms.get(ws.roomName);
    if (!room) return;

    switch (msg.type) {
      case 'final': {
        const text = String(msg.text || '').slice(0, 5000).trim();
        if (!text) return;
        const item = { id: crypto.randomUUID(), text, ts: Date.now() };
        room.history.push(item);
        if (room.history.length > HISTORY_LIMIT) room.history.shift();
        broadcast(room, { type: 'final', item });
        break;
      }
      case 'interim': {
        broadcast(room, { type: 'interim', text: String(msg.text || '').slice(0, 5000) }, ws);
        break;
      }
      case 'delete': {
        const idx = room.history.findIndex((it) => it.id === msg.id);
        if (idx !== -1) room.history.splice(idx, 1);
        broadcast(room, { type: 'delete', id: msg.id });
        break;
      }
      case 'clear': {
        room.history = [];
        broadcast(room, { type: 'clear' });
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!ws.roomName) return;
    const room = rooms.get(ws.roomName);
    if (!room) return;
    room.clients.delete(ws);
    if (room.clients.size === 0 && room.history.length === 0) {
      rooms.delete(ws.roomName);
    } else {
      presence(room);
    }
  });
});

// 定時清走死咗嘅連線
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { ws.terminate(); continue; }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`voice-relay listening on http://localhost:${PORT}`);
});
