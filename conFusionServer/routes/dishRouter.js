const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route('/')
  .get((req, res, next) => {
    Dishes.find({})
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dishes);
        },
        (err) => {
          console.log(next(err));
        }
      )
      .catch((err) => {
        console.log(next(err));
      });
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          console.log('Dish created - ', dish);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
        },
        (err) => {
          console.log(next(err));
        }
      )
      .catch((err) => {
        console.log(next(err));
      });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes!');
  })
  .delete((req, res, next) => {
    Dishes.remove({})
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
dishRouter
  .route('/:dishId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dish/' + req.params.dishId);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
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

module.exports = dishRouter;
