const express = require('express');
const http = require('http');

const host = 'localhost';
const port = 4000;

const app = express();

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>Hello World! Express Server.</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, host, () => {
    console.log(`Sevrer running at http://${host}:${port}`);
});
