const express = require('express');
const bodyParser = require('body-parser');

const Favourites = require('../models/favourites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

router
  .route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({
      user: req.user._id,
    })
      .populate('user')
      .populate('dishes')
      .then((fav) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
      })
      .catch((err) => {
        return next(err);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let dishIds = [];
    req.body.forEach((element) => {
      dishIds.push(element._id);
    });
    const favItem = {
      user: req.user._id,
      dishes: dishIds,
    };
    Favourites.findOne({ user: req.user._id }).then((fav) => {
      if (!fav || fav.length === 0) {
        Favourites.create(favItem)
          .then((fav) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fav);
          })
          .catch((err) => {
            return next(err);
          });
      } else {
        let newFavItem = 0;

        req.body.forEach((el) => {
          if (fav.dishes.indexOf(el._id) > -1) {
          } else {
            fav.dishes.push(el._id);
            newFavItem++;
          }
        });
        if (newFavItem < 1) {
          res.statusCode = 409;
          res.end('Dish list aleady exist');
        } else {
          fav.save().then(
            (fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(fav);
            },
            (error) => {
              next(error);
            }
          );
        }
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.remove({
      user: req.user._id,
    })
      .then((fav) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
      })
      .catch((err) => {
        return next(err);
      });
  });

router
  .route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    var favoriteData = {
      user: req.user._id,
      dishes: [req.params.dishId],
    };

    Favourites.findOne({ user: req.user._id }).then((favorite) => {
      // If Favorite document not exist, create new
      if (!favorite || favorite.length === 0) {
        Favourites.create(favoriteData)
          .then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            },
            (error) => {
              next(error);
            }
          )
          .catch((error) => {
            next(error);
          });
      } else {
        if (favorite.dishes.indexOf(req.params.dishId) > -1) {
          res.statusCode = 409;
          res.end(`Dish ${req.params.dishId} Already in favorite list`);
        } else {
          // Favorite dish not exist, add new
          favorite.dishes.push(req.params.dishId);
          favorite.save().then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            },
            (error) => {
              next(error);
            }
          );
        }
      }
    });
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, nextFunction) => {
      Favorites.findOne({ user: req.user._id, dishes: req.params.dishId }).then(
        (favorite) => {
          if (favorite != null) {
            favorite.dishes.remove(req.params.dishId);
            favorite.save().then(
              (favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              },
              (error) => {
                nextFunction(error);
              }
            );
          } else {
            res.statusCode = 409;
            res.end(
              `Dish ${req.params.dishId} not exist in your favorite list`
            );
          }
        },
        (error) => {
          nextFunction(error);
        }
      );
    }
  );

module.exports = router;
