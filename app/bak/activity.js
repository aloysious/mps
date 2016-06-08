module.exports = function (sequelize, DataTypes) {

  var Activity = sequelize.define('activity', {
		name:        { type: DataTypes.STRING(45) },
		description: { type: DataTypes.STRING(1024), allowNull: true },
		startTime:   { type: DataTypes.DATE, field: 'start_time' },
		endTime:     { type: DataTypes.DATE, field: 'end_time' },
		cost:        { type: DataTypes.INTEGER, allowNull: true },
		fromId:      { type: DataTypes.INTEGER, field: 'from_id' },
		status:      { type: DataTypes.INTEGER }
  }, {
		// table configration
		underscored: true,
		tableName: 't_activity',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Activity;
};
