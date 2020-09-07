const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');

const host = 'localhost';
const port = 4000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/dishes', dishRouter);

app.use(express.static(__dirname + '/public'));

app.get('/dish/:dishId', (req, res, next) => {
  res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
});

app.post('/dish/:dishId', (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dish/' + req.params.dishId);
});

app.put('/dish/:dishId', (req, res, next) => {
  res.write('Updating the dish: ' + req.params.dishId + '\n');
  res.end(
    'Will update the dish: ' +
      req.body.name +
      ' with details: ' +
      req.body.description
  );
});

app.delete('/dish/:dishId', (req, res, next) => {
  res.end('Deleting dish: ' + req.params.dishId);
});
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
