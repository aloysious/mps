/**
 * 微信基础工具模块
 *
 * @author aloysiousliang@gmail.com
 * @date 2016-05-06
 */
var config = require('../config/config');
var urllib = require('urllib');
var Q = require('q');

var WxUtil = {

	/**
	 * 主动调用微信API的封装
	 * @param path      {String}   调用的api路径，如'/user/getuserinfo'
	 * @param options   {Object}   配置项，参考: https://www.npmjs.com/package/urllib
	 */
	invokeApi: function(path, options) {
		var defered = Q.defer();
		var that = this;

		if (!path) throw new Error('WxUtil.invokeApi#Param error: path is required');

		var url = 'https://' + config.wx.qyApiHost + path + '?access_token=' + global.accessToken;
		options = options || {};
		options.dataType = 'json';

		console.log('invoke api: ' + url);
		urllib.request(url, options, function(err, data, res) {
			if (err) {
				defered.reject(err);
			} else {
				// api返回错误
				if (data.errcode && data.errcode != 0) {
					// 应该特殊处理accessToken异常的情况，40001accessToken无效，40014accessToken不合法
					// 重新获取一次accessToken后，再次尝试调用api
					if (data.errcode == 40001 || data.errcode == 40014) {
						that.getWxAccessToken()
						.then(function(t) {
							return that.invokeApi(path, options);
						})
						.then(function(data) {
							defered.resolve(data);
						})
						.catch(function(err) {
							defered.reject(err);
						});

					// 其它错误直接抛出
					} else {
						data.errmsg = data.errmsg || 'unknown error';
						var resError = new Error('WxUtil.invokeApi#Api response error: ' + data.errmsg);
						defered.reject(resError);
					}
				
				// 返回成功
				} else {
					console.log('invoke api response data: ' + JSON.stringify(data));
					defered.resolve(data);
				}
			}
		});

		return defered.promise;
		
	},
	
	accessTokenTimer: null,

	/**
	 * 获取微信access_token
	 * 7200s失效，失效后重新获取，作为全局变量存储
	 * 注意：如果是多服务器需要改成redis存储
	 */
	getWxAccessToken: function() {
		var defered = Q.defer();
		var that = this;
	
		var url = 'https://' + config.wx.qyApiHost + 
			'/gettoken?corpid=' + config.wx.corpId + '&corpsecret=' + config.wx.corpSecret;
		var options = {
			method: 'GET',
			dataType: 'json'
		};
		urllib.request(url, options, function(err, data, res) {
			// https调用错误
			if (err) {
				defered.reject(err);

			} else {
				// api返回错误
				if (data.errcode && data.errcode != 0) {
					data.errmsg = data.errmsg || 'unknown error';
					var resError = new Error('WxUtil.getWxAccessToken#Api response error: ' + data.errmsg);
					defered.reject(resError);
				
				// 返回成功
				} else {
					global.accessToken = data.access_token;
					console.log(global.accessToken);
					
					if (that.accessTokenTimer) clearTimeout(that.accessTokenTimer);
					that.accessTokenTimer = setTimeout(function() {
						that.getWxAccessToken();
					}, data.expires_in * 1000);

					defered.resolve(data.access_token);
				}
			}
			
		});

		return defered.promise;
	}

};

module.exports = WxUtil;
