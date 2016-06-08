var Q = require('q');
var model = require('../models');

/**
 * 根据id获取管理员信息
 */
module.exports.getAdminById = function(id) {
 	return model.admin.findOne({
		where: {id: +id}
  });
};
