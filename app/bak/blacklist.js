module.exports = function (sequelize, DataTypes) {

  var Blacklist = sequelize.define('blacklist', {
		userId:     { type: DataTypes.INTEGER, field: 'user_id' },
		activityId: { type: DataTypes.INTEGER, field: 'activity_id' },
		reason:     { type: DataTypes.STRING(256) }
  }, {
		// table configration
		underscored: true,
		tableName: 't_blacklist',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Blacklist;
};
