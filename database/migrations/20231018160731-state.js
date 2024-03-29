'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('states', {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        countryID: {
          type: Sequelize.BIGINT,
          references: {
            model: {
              tableName: 'countries',
              modelName: 'Country'
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
        deletedBy: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: 'users',
              modelName: 'User'
            },
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        createdBy: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: 'users',
              modelName: 'User'
            },
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedBy: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: 'users',
              modelName: 'User'
            },
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
      }, { transaction });

      await queryInterface.addIndex('states', ['name', 'countryID'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('states');
  }
};
