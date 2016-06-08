module.exports = function (sequelize, DataTypes) {

  var ApplyField = sequelize.define('applyField', {
		category:        { type: DataTypes.INTEGER },
		label:           { type: DataTypes.STRING(20) },
		placeholder:     { type: DataTypes.STRING(45), allowNull: true },
		order:           { type: DataTypes.INTEGER, defaultValue: 0 },
		fieldName:       { type: DataTypes.STRING(20), field: 'field_name' },
		defaultValue:    { type: DataTypes.STRING(45), field: 'default_value', allowNull: true },
		applyTemplateId: { type: DataTypes.INTEGER, field: 'apply_template_id' }
  }, {
		// table configration
		underscored: true,
		tableName: 't_apply_field',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return ApplyField;
};
