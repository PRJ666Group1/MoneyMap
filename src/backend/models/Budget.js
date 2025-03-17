const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Budget = sequelize.define('Budget', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  income: { type: DataTypes.FLOAT, allowNull: false },
  expenseAmount: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  amountSpent: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = Budget;
