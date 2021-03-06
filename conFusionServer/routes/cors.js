const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4000'];

const corsOptionsDelegate = (req, cb) => {
  let corsOptions;
  if (whiteList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { Origin: true };
  } else {
    corsOptions = { Origin: false };
  }
  cb(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
