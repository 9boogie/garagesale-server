'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.belongsTo(models.Garage_sales, {
        foreignKey: 'sale_id'
      })
    }
  };
  Products.init({
    garage_sales_id: DataTypes.INTEGER,
    products_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};