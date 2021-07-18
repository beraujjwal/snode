'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserPermission.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER,
    permission: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserPermission',
    tableName: 'user_permissions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  UserPermission.associate = function(models) {
    UserPermission.belongsTo(models.User, {foreignKey: 'user_id'})
    UserPermission.belongsTo(models.Permission, {foreignKey: 'permission_id'})
  };
  return UserPermission;
};
