var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('../app/routes');
var config = require('./config');
var wxUtil = require('../lib/wxUtil');
var wxOauth = require('../middlewares/wxOauth');

module.exports = function(app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'xtpl');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  app.use(session({secret: config.session.secret, saveUninitialized: true, resave: true}));
	app.use(wxOauth({
		path: /^\/game/,
		filter: function(req) {
			//console.log(req.session[config.userKey]);
			return req.session && req.session[config.userKey];	
		}
	}));
	
	// 启动server时，获取access_token
	wxUtil.getWxAccessToken();

  // 路由
  routes(app);

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
