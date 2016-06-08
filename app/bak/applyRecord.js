module.exports = function (sequelize, DataTypes) {

  var ApplyRecord = sequelize.define('applyRecord', {
		userId:          { type: DataTypes.INTEGER, field: 'user_id' },
		applyTemplateId: { type: DataTypes.INTEGER, field: 'apply_template_id' },
		values:          { type: DataTypes.STRING(512) },
		status:          { type: DataTypes.INTEGER, defaultValue: 0 },
		receiverId:      { type: DataTypes.INTEGER, field: 'receiver_id' },
		receiverComment: { type: DataTypes.STRING(255), field: 'receiver_comment' allowNull: true },
		userComment:     { type: DataTypes.STRING(255), field: 'user_comment', allowNull: true },
		starLevel:       { type: DataTypes.INTEGER, field: 'star_level', allowNull: true }
  }, {
		// table configration
		underscored: true,
		tableName: 't_apply_record',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return ApplyRecord;
};
