"use strict";
const { sequelize, DataTypes } = require("../system/core/db.connection");
const User = require("./user.model");

const Menu = sequelize.define(
  "Menu",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    parentID: {
      type: DataTypes.BIGINT.UNSIGNED,
      references: {
        model: {
          tableName: "menus",
          modelName: "Menu",
        },
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      validate: {
        isInt: true,
        notIn: [[1, 2]],
      },
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      index: true,
      allowNull: false,
      validate: {
        isAlpha: true,
        notIn: [["Super Admin", "Admin"]],
      },
    },
    slug: {
      type: DataTypes.STRING,
      required: true,
      index: true,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: true,
        async isUnique(value) {
          const menu = await sequelize.models.Menu.findOne({
            where: { slug: value, parentId: this.parentId },
          });
          if (menu) {
            throw new Error("Menu name already used.");
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "This column is for checking if the menu is active or not.",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize,
    modelName: "Menu",
    tableName: "menus",
    indexes: [{ unique: true, fields: ["name", "slug"] }],
    defaultScope: {
      attributes: {
        exclude: ["deletedAt", "deletedBy", "createdBy", "updatedBy"],
      },
      // include: [
      //   {
      //     model: User,
      //     as: "createdByUser",
      //     attributes: ["id", "name", "phone", "email", "status"],
      //     required: false,
      //   },
      //   {
      //     model: User,
      //     as: "updatedByUser",
      //     attributes: ["id", "name", "phone", "email", "status"],
      //     required: false,
      //   },
      // ],
    },
    scopes: {
      withPermissions: {
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      },
    },
    instanceMethods: {
      // async generateHash(password) {
      //   const salt = await bcrypt.genSalt(saltRounds);
      //   return bcrypt.hashSync(user.password, salt);
      // },
      // async validPassword(password) {
      //     return bcrypt.compareSync(password, this.password);
      // }
    },
    hooks: {
      beforeCreate: async (user) => {
        // if (user.password) {
        //   const salt = await bcrypt.genSalt(saltRounds);
        //   user.password = bcrypt.hashSync(user.password, salt);
        // }
      },
      beforeUpdate: async (user) => {
        // if (user.password) {
        //   const salt = await bcrypt.genSalt(saltRounds);
        //   user.password = bcrypt.hashSync(user.password, salt);
        // }
      },
    },
  }
);

Menu.associate = function (models) {
  Menu.hasMany(Menu, {
    as: "childrens",
    foreignKey: "parentID",
    attributes: ["id", "name", "slug", "status"],
    required: false,
    auto: true,
  });

  Menu.belongsTo(Menu, {
    as: "parent",
    foreignKey: "parentID",
    attributes: ["id", "name", "slug", "status"],
    required: false,
    auto: true,
  });

  Menu.belongsToMany(models.Resource, {
    through: {
      model: models.MenuResource,
      unique: false,
      sourceKey: "resourceID",
      scope: {
        status: true,
      },
    },
    foreignKey: "menuID",
    as: "menuResources",
    constraints: true,
  });

  Menu.belongsTo(models.User, { as: "createdByUser", foreignKey: "createdBy" });
  Menu.belongsTo(models.User, { as: "updatedByUser", foreignKey: "updatedBy" });
};

module.exports = Menu;
