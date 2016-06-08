/**
 * 微信OAuth2.0认证中间件
 *
 * @author aloysiousliang@gmail.com
 * @date 2016-05-04
 */
var _ = require('underscore');
var md5 = require('md5');
var config = require('../config/config');
var wxUtil = require('../lib/wxUtil');
//var userController = require('../app/controllers/userController');

var OAUTH2_URL = 'https://open.weixin.qq.com/connect/oauth2/authorize';
var GET_USER_INFO_URL = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo';

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

		// 如果参数中无code，跳转oauth2.0获取code
		if (!req.query.code || req.query.code === '') {
			var returnUrl = OAUTH2_URL + '?appid=' + config.wx.corpId + 
				'&redirect_uri=' + encodeURIComponent(req.protocol + '://' + req.hostname + ':' + config.port + req.url) + 
				'&response_type=code&scope=snsapi_base#wechat_redirect';
			return res.redirect(returnUrl);
		
		// 参数中带code，通过code换取用户userid
		} else {
			wxUtil.invokeApi('/user/getuserinfo', {
				data: {code: req.query.code}
			})
			.then(function(data) {
				if (!data.UserId) {
					throw new Error('WxOauth#GetUserInfo response data error: userId is required');
				} else {
					// 获取用户基本信息
					return wxUtil.invokeApi('/user/get', {
						data: {userid: data.UserId}
					});
				}
			})
			.then(function(data) {
				// data的数据结构参考：http://qydev.weixin.qq.com/wiki/index.php?title=%E7%AE%A1%E7%90%86%E6%88%90%E5%91%98
				req.session[config.userKey] = data;
				return next();
			})
			.catch(function(err) {
				res.send(JSON.stringify(err));
			});
		}
	
	};
};
