'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('role_resource_permissions', {
      id: {
        type: Sequelize.BIGINT(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      roleId: {
        type: Sequelize.BIGINT(11),
        references: {
          model: {
            tableName: 'roles',
            modelName: 'Role'
          },
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      resourceId: {
        type: Sequelize.BIGINT(11),
        references: {
          model: {
            tableName: 'resources',
            modelName: 'Resource'
          },
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      permissionId: {
        type: Sequelize.BIGINT(11),
        references: {
          model: {
            tableName: 'permissions',
            modelName: 'Permission'
          },
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }).then(() => queryInterface.addIndex('role_resource_permissions', ['roleId', 'resourceId', 'permissionId']));



    // queryInterface.addConstraint("role_resource_permissions", {
    //     type: "FOREIGN KEY",
    //     name: "role_resource_permissions_role_id_fkey",
    //     fields: ["roleId"],
    //     references: {
    //         table: "roles",
    //         field: "id"
    //     }
    // });
    // queryInterface.addConstraint("role_resource_permissions", {
    //     type: "FOREIGN KEY",
    //     name: "role_resource_permissions_user_id_fkey",
    //     fields: ["user_id"],
    //     references: {
    //         table: "auth_user",
    //         field: "id"
    //     }
    // });
    // queryInterface.addConstraint("role_resource_permissions", {
    //     type: "FOREIGN KEY",
    //     name: "role_resource_permissions_role_id_fkey",
    //     fields: ["role_id"],
    //     references: {
    //         table: "role",
    //         field: "id"
    //     }
    // });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('role_resource_permissions');
  }
};