var Q = require('q');
var model = require('../models');

/**
 * 获取特定活动的中奖列表
 */
module.exports.listByActivityId = function(activityId, offset, size) {};

/**
 * 获取特定用户的中奖列表
 */
module.exports.listByUserId = function(userId) {};

/**
 * 更改领奖状态
 */
module.exports.changeAwardStatus = function(userId, winId, isAccepted) {};
