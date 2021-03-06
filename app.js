var express = require('express');
var config = require('./config');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MoongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(_dirname, 'public')));
app.use(session({
  cookie: {masAge: 1000*60*30} ,
  secret: "session secret" ,
  resave: false,
  saveUninitialized: true,
  store:new Mongoostore({
    db:config.mongo_db,
    url: 'mongodb://'+config.database.mongodb.host+":"+config.database.mongodb.port+"/"+config.database.mongodb.database,
    host: config.database.mongodb.host,
    port: config.database.mongodb.port,
    auto_reconnect:true
  })
}))

require('./bootstrap');

app.use('/',require('./routes/index'))
app.use('/api',require('./routes/api'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('nynda ada');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.messagel
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(res.locals.message);
console.log(res.locals.error.stack);
console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
