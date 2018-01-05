var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
//var users = require('./routes/users');
var am = require('./routes/asset-management');
const user = require('./routes/user')
const login = require('./src/control/login')

var select = require('./routes/select_list');
var machine = require('./routes/machine');
var address = require('./routes/address');
var ascription = require('./routes/ascription');
var use_record = require('./routes/use_record');
const equip = require('./routes/equip');
const authority = require('./routes/authority')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes use area
//拦截所有请求，并对请求进行验证
app.use(async (req, res, next) => {
  const no_valid = ['/am/user/login'];
  if (no_valid.indexOf(req.url) > -1) {
    console.log('login url')
    next();
  } else {
    console.log('before valid')
    let valid_flag = await login.validRequest(req, res);
    if (valid_flag) {
      console.log('after valid')
      res['cookies'] = req.cookies;
      next();
    }
    //此处为调试的时候跳过身份验证使用，使用的时候将else内的内容注释，添加next()即可
    //next();
    //res.status(400).send({message: 'stop it'})
  }  
})
app.use('/', index);
//app.use('/users', users);
app.use('/am/user', user);
app.use('/am', am);
app.use('/am/select',select);
app.use('/am/machine',machine);
app.use('/am/address',address);
app.use('/am/equip', equip);
app.use('/am/authority', authority);
app.use('/am/ascription', ascription);
app.use('/am/use', use_record);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
