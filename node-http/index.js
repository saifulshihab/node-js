const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = '4000';

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} by method ${req.method}`);

  if (req.method == 'GET') {
    let fileUrl;

    if (req.url === '/') fileUrl = '/index.html';
    else fileUrl = req.url;

    const filePath = path.resolve('./public' + fileUrl);
    const fileExt = path.extname(filePath);
    if (fileExt === '.html') {
      fs.exists(filePath, (exist) => {
        if (!exist) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end(
            '<html><body><h1>Error 404: ' +
              fileUrl +
              ' not found</h1></body></html>'
          );
          return;
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          fs.createReadStream(filePath).pipe(res);
        }
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end(
        '<html><body><h1>Error 404: ' +
          fileUrl +
          ' not a HTML file!</h1></body></html>'
      );
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end(
      `<html><body><h1>Error 404: ${req.method} not supported!</h1></body></html>`
    );
  }
});

server.listen(port, host, () => {
  console.log(`Sevrer running at http://${host}:${port}`);
});
