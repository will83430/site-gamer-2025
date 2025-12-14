const http = require('http');

console.log('🔄 Creating HTTP server...');

const server = http.createServer((req, res) => {
  console.log(`📨 Request received: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, message: 'Native HTTP server works!' }));
  
  console.log('✅ Response sent');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('✅ Server listening on http://localhost:3000 (127.0.0.1)');
  console.log('Server address:', server.address());
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('exit', (code) => {
  console.log(`⚠️ Process exiting with code: ${code}`);
});

// Keep process alive
setInterval(() => {
  // Just keep alive, do nothing
}, 1000);

console.log('✅ Script loaded, server starting...');
console.log('Press Ctrl+C to stop');
