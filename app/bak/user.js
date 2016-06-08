module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('user', {
		fromUserId: { type: DataTypes.STRING(128), field: 'from_user_id' },
		avatar:     { type: DataTypes.STRING(512), allowNull: true },
		nick:       { type: DataTypes.STRING(45), allowNull: true },
		score:      { type: DataTypes.INTEGER, allowNull: true },
		fromId:     { type: DataTypes.INTEGER, field: 'from_id' },
		expireTo:   { type: DataTypes.BIGINT(20), field: 'expire_to' },
		realName:   { type: DataTypes.STRING(45), field: 'real_name', allowNull: true },
		phone:      { type: DataTypes.STRING(20), allowNull: true },
		address:    { type: DataTypes.STRING(256), allowNull: true }
  }, {
		// table configration
		underscored: true,
		tableName: 't_user',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return User;
};
