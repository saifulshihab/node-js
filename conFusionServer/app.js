const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
const favouriteRouter = require('./routes/favouriteRouter');
const commentRouter = require('./routes/commentRouter');

const app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      'https://' + req.hostname + ':' + app.get('secPort') + req.url
    );
  }
});

const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
const session = require('express-session');
const fileStore = require('session-file-store')(session);

connect.then(
  (db) => {
    console.log(
      '\n==================- Connected to MongoDB Server -====================\n'
    );
  },
  (err) => {
    console.log(err);
  }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser('12345-5675675-32457834-23'));

// app.use(
//   session({
//     name: 'session-id',
//     secret: '12345-5675675-32457834-23',
//     saveUninitialized: false,
//     resave: false,
//     store: new fileStore(),
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imageUpload', uploadRouter);

// function auth(req, res, next) {
//   if (!req.user) {
//     const err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   } else {
//     /* if (req.session.user === 'shihab') {
//       next();
//     } else {
//       let err = new Error('You are not authenticated!');
//       err.status = 401;
//       next(err);
//     } */
//     next();
//   }
// }
// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/favourites', favouriteRouter);
app.use('/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
