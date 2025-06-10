const { DataTypes } = require('sequelize');
const sequelize         = require('../db');

const StockCentral = sequelize.define('StockCentral', {
  inventaire: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  }
}, {
  // On empêche Sequelize de renommer la table au pluriel
  freezeTableName: true,
  tableName: 'StockCentral'
});

module.exports = StockCentral;