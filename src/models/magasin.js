const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Magasin = sequelize.define('Magasin', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Magasin;
