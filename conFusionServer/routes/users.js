const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});
router.get(
  '/',
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({})
      .then((users) => {
        if (users !== null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(users);
        } else {
          next(err);
        }
      })
      .catch((err) => next(err));
  }
);

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    }
  );
});

// router.post('/login', function (req, res, next) {
//   if (!req.session.user) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       const err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
//     const auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
//       .toString()
//       .split(':');
//     const username = auth[0];
//     const password = auth[1];

//     User.findOne({ username: username })
//       .then((user) => {
//         if (user === null) {
//           var err = new Error('User ' + username + ' does not exist!');
//           err.status = 403;
//           return next(err);
//         } else if (user.password !== password) {
//           var err = new Error('Your password is incorrect!');
//           err.status = 403;
//           return next(err);
//         } else if (user.username === username && user.password === password) {
//           req.session.user = 'shihab';
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'text/plain');
//           res.end('You are authenticated');
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'json/application');
//     res.end('You are already authenticated!');
//   }
// });
router.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: false,
        status: 'Login Failed!',
        err: info,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false,
          status: 'Login Failed!',
          err: 'User could not login!',
        });
      }
      const token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        status: 'Login Successfull!',
      });
    });
  })(req, res, next);
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ status: 'JWT Invalid', success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ status: 'JWT Valid', success: true, user: user });
    }
  })(req, res);
});

router.get(
  '/facebook/token',
  passport.authenticate('facebook-token'),
  (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!',
      });
    }
  }
);

module.exports = router;
