const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

const Promotions = require('../models/promotions');

promoRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.find(req.query)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promo) => {
          console.log('Leader created - ', promo);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => {
          console.log(next(err));
        }
      )
      .catch((err) => {
        console.log(next(err));
      });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion!');
  })
  .delete(cors.corsWithOptions, 
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.remove({})
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
    }
  );

promoRouter
  .route('/:promoId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotion/' + req.params.promoId);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, 
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndRemove(req.params.promoId)
        .then(
          (res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(res);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = promoRouter;
