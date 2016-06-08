module.exports = function (sequelize, DataTypes) {

  var Admin = sequelize.define('admin', {
		department:        { type: DataTypes.STRING, allowNull: true },
		email:             { type: DataTypes.STRING },
		isAccountEnabled:  { type: DataTypes.BOOLEAN, field: 'is_account_enabled' },
		isAccountExpired:  { type: DataTypes.BOOLEAN, field: 'is_account_expired' },
		isAccountLocked:   { type: DataTypes.BOOLEAN, field: 'is_account_locked' },
		lockedDate:        { type: DataTypes.DATE, field: 'locked_date', allowNull: true },
		loginDate:         { type: DataTypes.DATE, field: 'login_date', allowNull: true },
		loginFailureCount: { type: DataTypes.BIGINT(11), field: 'login_failure_count', defaultValue: 0 },
		loginIp:           { type: DataTypes.STRING, field: 'login_ip', allowNull: true },
		name:              { type: DataTypes.STRING, allowNull: true },
		password:          { type: DataTypes.STRING },
		username:          { type: DataTypes.STRING }
  }, {
		// table configration
		underscored: true,
		tableName: 't_admin',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Admin;
};
