module.exports = function (sequelize, DataTypes) {

  var Win = sequelize.define('win', {
		userId:         { type: DataTypes.INTEGER, field: 'user_id' },
		activityId:     { type: DataTypes.INTEGER, field: 'activity_id' },
		awardId:        { type: DataTypes.INTEGER, field: 'award_id' },
		getAwardStatus: { type: DataTypes.BOOLEAN, field: 'get_award_status' }
  }, {
		// table configration
		underscored: true,
		tableName: 't_win',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Win;
};
