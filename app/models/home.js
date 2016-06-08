module.exports = function (sequelize, DataTypes) {

  var Home = sequelize.define('home', {
		partyId:  { type: DataTypes.INTEGER, field: 'party_id' },
		name:     { type: DataTypes.STRING(45), allowNull: true },
		notice:   { type: DataTypes.STRING(255), allowNull: true }
  }, {
		// table configration
		underscored: true,
		tableName: 't_home',
		updatedAt: 'modify_date',
		createdAt: 'create_date'
	});

  return Home;
};
