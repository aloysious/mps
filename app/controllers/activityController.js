var Q = require('q');
var model = require('../models');

/**
 * 活动列表
 */
module.exports.list = function(offset, size) {};

/**
 * 活动详情，通过获取活动对应的奖品配置
 */
module.exports.getDetailWithAward = function(id) {};

/**
 * 保存活动配置（新增或更新）
 */
module.exports.save = function(savedActivity) {};

/**
 * 发布活动
 */
module.exports.publish = function(id) {};

/**
 * 下架活动
 */
module.exports.offline = function(id) {};

/**
 * 抽奖
 */
module.exports.doLottery = function(userId, activityId) {};
