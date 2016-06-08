var express = require('express');
var router = express.Router();

//var admin = require('./adminRoute');
var game = require('./gameRoute');

module.exports = function(app) {
  /* 首页 */
  app.get('/', function(req, res, next) {
		res.render('error');
  });
	/*
	app.use('/admin', admin);
	*/
	app.use('/game', game);
};
