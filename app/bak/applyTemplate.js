module.exports = function (sequelize, DataTypes) {

  var ApplyTemplate = sequelize.define('applyTemplate', {
		name:        { type: DataTypes.STRING(20) },
		description: { type: DataTypes.STRING(255), allowNull: true }
  }, {
		// table configration
		underscored: true,
		tableName: 't_apply_template',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return ApplyTemplate;
};
