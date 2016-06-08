/**
 * 前台登录校验中间件
 *
 * @author aloysiousliang@gmail.com
 * @date 2016-04-07
 *
 */
var _ = require('underscore');
var md5 = require('md5');
var config = require('../config/config');
var userController = require('../app/controllers/userController');

/**
 * 校验登录用户信息的有效性
 * 1. 登录用户参数是否附带完整（openid, headPhoto, nickName, unionid, timestamp, sign）
 * 2. 参数是否被篡改
 * 3. timestamp是否在允许的调用时间范围内
 */
function _checkLoginQuery(req) {
	var queryKeys = _.keys(req.query),
			flag = true;
	_.each(['openid', 'headPhoto', 'nickName', 'unionid', 'timestamp', 'sign'], function(item) {
		if (!_.contains(queryKeys, item)) {
			flag = false;
			return false;
		}
	});
	if (!flag) return false;

	// md5校验
	var mySign = md5(req.query.openid + req.query.unionid + req.query.timestamp + config.wc.yandou.key);
	if (mySign !== req.query.sign) return false;

	// 有效的调用时延，5秒
	if (Math.abs(+req.query.timestamp - _.now()) > 5000) return false;

	return true;
}

/**
 * @param options {Object} 配置参数
 *         - path {Reg}
 *         - filter {Function}
 */
module.exports = function(options) {
	return function(req, res, next) {
		if (options.path && !options.path.test(req.url)) {
			return next();
		}

		if (_.isFunction(options.filter) && options.filter(req)) {
			return next();
		}

		// 如果url没附带有登录用户信息，或者参数非法
		// 引导auth2.0
		if (!_checkLoginQuery(req)) {
			// TODO
			//res.redirect();
			//fade
			var params = {
				openid: "ooku7jn9d42aYsRGwqh6hgVj_kYw",
				unionid: "",
				timestamp: _.now(),
				nickName: 'Aloysious',
				headPhoto: ''
			};
			params.sign = md5(params.openid + params.unionid + params.timestamp + config.wc.yandou.key);
			var paramsStr = '';
			_.each(params, function(v, k) {
				paramsStr += k + '=' + v + '&';
			});
			return res.redirect(req.path + '?' + paramsStr);
		}

		// 如果访问的url附带有登录用户的信息，
		// 校验有效后，更新用户表，更新session
		userController.addUser({
			fromUserId: req.query.openid,
			avatar: req.query.headPhoto || '',
			nick: req.query.nickName || ''			
		})
		.then(function(user) {
			req.session[config.userKey] = user;
			return next();
		})
		.catch(function(e) {
			res.send('middlewares::needlogin::error ' + JSON.stringify(e));
		});
	};
};
