const http = require('http');

const host = '127.0.0.1';
const port = '4000';

const server = http.createServer((req, res) => {
  console.log(req.headers);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<html><body><h1>Hello World!</h1></body></html>`);
});

server.listen(port, host, () => {
  console.log(`Sevrer running at http://${host}:${port}`);
});
