module.exports = function (sequelize, DataTypes) {

  var Record = sequelize.define('record', {
		userId:     { type: DataTypes.INTEGER, field: 'user_id' },
		activityId: { type: DataTypes.INTEGER, field: 'activity_id' },
		accessLog:  { type: DataTypes.STRING(1024), field: 'access_log', allowNull: true }
  }, {
		// table configration
		underscored: true,
		tableName: 't_record',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Record;
};
