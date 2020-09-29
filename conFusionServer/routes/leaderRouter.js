const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          console.log('Leader created - ', leader);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => {
          console.log(next(err));
        }
      )
      .catch((err) => {
        console.log(next(err));
      });
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders!');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
      .then(
        (res) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(res);
        },
        (err) => {
          console.log(next(err));
        }
      )
      .catch((err) => next(err));
  });

leaderRouter
  .route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leader/' + req.params.leaderId);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(
        (res) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(res);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
