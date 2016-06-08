module.exports = function (sequelize, DataTypes) {

  var Notice = sequelize.define('notice', {
		title:     { type: DataTypes.STRING(45) },
		content:   { type: DataTypes.STRING(1024) },
		toParty:   { type: DataTypes.STRING(512), field: 'to_party', allowNull: true },
		toUser:    { type: DataTypes.STRING(512), field: 'to_user', allowNull: true }
  }, {
		// table configration
		underscored: true,
		tableName: 't_notice',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Notice;
};
