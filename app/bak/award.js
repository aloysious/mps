module.exports = function (sequelize, DataTypes) {

  var Award = sequelize.define('award', {
		name:        { type: DataTypes.STRING(45) },
		picUrl:      { type: DataTypes.STRING(512), field: 'pic_url', allowNull: true },
		level:       { type: DataTypes.INTEGER },
		type:        { type: DataTypes.INTEGER },
		stock:       { type: DataTypes.INTEGER },
		probability: { type: DataTypes.FLOAT },
		activityId:  { type: DataTypes.INTEGER, field: 'activity_id' }
  }, {
		// table configration
		underscored: true,
		tableName: 't_award',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Award;
};
