var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');

var app = express();
var config = require('./config/config')[app.get('env')];

require('./models/Users');
require('./models/Stories');
require('./models/Dashboards');
require('./models/TobaccoPricings');
require('./models/Milestones'); 
require('./models/NicotineUsages');
require('./models/Forums');
require('./models/Posts');
require('./models/Feedbacks');
require('./config/passport');

var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('this is a fat error: ' + err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('this is a fatter error: ' + err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

mongoose.connect('mongodb://localhost/kryptonite'/*'mongodb://heroku_nw9xd3vv:laldboi884bgja098m6sa1npom@ds045882.mongolab.com:45882/heroku_nw9xd3vv'*/, function(err){
  if (err) {
    console.log(err);
  }
});

var db = mongoose.connection;
