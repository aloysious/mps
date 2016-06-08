var path = require('path'),
		logger = require('../lib/logger'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wechat'
    },
    port: 7001,
		session: {
	  	secret: 'wechat_session_13811174565'
		},
		userKey: 'gxzy_user',
    db: {
	  	name: 'hy_property',
	  	user: 'root',
	  	password: 'ld1908071220',
	  	host: '127.0.0.1',
	  	port: '3306'
		},
		wx: {
			corpId: 'wxd3a3af63eb8ff2ff',
			corpSecret: 'lXR9NTgqI5_Elnn4PkcFAi7iQ-m852g0UKLxGNjY5dacK7M5GFHeRBvQkDdg6m5S',
			qyApiHost: 'qyapi.weixin.qq.com/cgi-bin'
		},
		logger: {
			logdir: path.join(__dirname, "../logs"),
			duration: 3600000 * 24,
			nameformat: '[{{level}}.]YYYY-MM-DD[.log]',
			stderr: true, // show error stack in stderr or not
			level: logger.INFO, // 默认输出 INFO 及以上级别的日志
			stdoutLevel: logger.ERROR, // 输出到标准输出的最低级别, 默认不输出
			accessLog: true
		}
  },

  test: {
    root: rootPath,
    app: {
      name: 'wechat'
    },
    port: 3000,
    db: 'mysql://localhost/wechat-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'wechat'
    },
    port: 3000,
    db: 'mysql://localhost/wechat-production'
  }
};

module.exports = config[env];
