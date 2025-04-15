const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Serve the index.html file
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Message handler
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received message:', parsedMessage);
      
      // Handle different message types
      switch (parsedMessage.type) {
        case 'login':
          console.log(`User login: ${parsedMessage.data.name}`);
          // Send response back to client
          ws.send(JSON.stringify({
            type: 'login',
            data: {
              success: true,
              message: `Welcome, ${parsedMessage.data.name}!`
            }
          }));
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            data: {
              message: 'Unknown message type'
            }
          }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: {
          message: 'Invalid message format'
        }
      }));
    }
  });

  // Close handler
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Error handler
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
