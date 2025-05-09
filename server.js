const WebSocket = require("ws");
const os = require('os');

// Get local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let addr of iface) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost if no external IP is found
}

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const clients = new Set();

// Log server information when it starts
const ipAddress = getLocalIpAddress();
console.log(`🚀 WebSocket Server running at:`);
console.log(`   - IP Address: ${ipAddress}`);
console.log(`   - Port: ${PORT}`);

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("🔌 Client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message);
    // Broadcast to all other clients
    for (let client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("❌ Client disconnected");
  });
});
