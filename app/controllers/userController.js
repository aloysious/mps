var Q = require('q');
var _ = require('underscore');
var model = require('../models');

/**
 * 添加用户
 */
module.exports.addUser = function(userObj) {
	var deferred = Q.defer();

	if (!_.isObject(userObj) || !userObj.fromUserId) {
		deferred.reject(new Error('userController::addUser::paramError'));
		return deferred.promise;
	}

	var newUser = _.extend(userObj, {
			fromId: 1, /* tmp */
			expireTo: _.now() + 1000 * 60 * 60 * 2, /* 有效期为两小时 */
	});

	model.user.findOrCreate({
		where: {fromUserId: userObj.fromUserId},
		defaults: newUser
	})
	.spread(function(user, created) {
		// 如果新建用户成功，返回user
		if (created) {
			return user;
		// 否则更新用户信息
		} else {
			model.user.update(newUser, {
				where: {id: user.id}
			});
			return _.extend(user, newUser);
		}
	})
	.then(function(user) {
		deferred.resolve(user);
	})
	.catch(function(e) {
		deferred.reject(e);
	});

	return deferred.promise;
};

/**
 * 获取用户信息
 */
module.exports.getUserInfo = function(userId) {};

/**
 * 保存用户信息
 */
module.exports.saveUserInfo = function(savedUser) {};

/**
 * 获取用户联系信息
 */
module.exports.getContact = function(userId) {};

/**
 * 保存用户联系信息
 */
module.exports.saveContact = function(userId, savedContact) {};
