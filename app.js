var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models');

var app = express();

// 主体配置
require('./config/express')(app, config);

// db连接 & 起服务
/*
db.sequelize
  .sync()
  .then(function () {
    app.listen(config.port);
  }).catch(function (e) {
    throw new Error(e);
  });
*/
app.listen(config.port);
