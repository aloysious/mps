var _ = require('underscore');

/**
 * Usage: 
 *   1. 
 *   app.use(checklogin({
 *     path: '/',
 *     redirect: '/user/login' | function(req, res) {xxx}
 *   }));
 *
 *   2. 
 *   app.get('/account', checklogin({redirect: '/user/login' | function(req, res) {xxx}}), function(req, res) {xxx});
 *
 *   @param option {Obejct} 配置项
 *     - option.path     {String} 需要进行登录校验的路由
 *     - option.redirect {String | Function} 登录不成功后的跳转地址，或者执行函数
 */
module.exports = function(option) {
  return function(req, res, next) {
 	if ((option.path && req.path.indexOf(option.path) === 0) 
	  || !option.path) {
	  if (req.isAuthenticated()) {return next();}
		var redir = option.redirect || '/user/login';
		if (_.isString(redir)) {
		  res.redirect(redir);
		} else if (_.isFunction(redir)) {
		  redir.call(this, req, res);
		} else {
		  throw new Error('#MiddlewareCheckLoginError: option.redirect should be string or function!');
		}
	} else {
		return next();
	}
  };

};
