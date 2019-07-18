'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('meetups', { 
        id: {
          type:Sequelize.INTEGER,
          allowNull:false,
          autoIncrement:true,
          primaryKey:true
        },
        title:{
          type:Sequelize.STRING,
          allowNull:false,
        },
        location:{
          type:Sequelize.STRING,
          allowNull:false,
        },
        description:{
          type:Sequelize.STRING,
          allowNull:false,
        },
        date:{
          type:Sequelize.DATE,
          allowNull:false
        },
        user_id:{
          type:Sequelize.INTEGER,
          allowNull:true,
          references:{
            model:'users',
            key:'id'
          },
          onUpdate:'CASCADE',
          onDelete:'SET NULL'
        },
        banner_id:{
          type:Sequelize.INTEGER,
          allowNull:true,
          references:{
            model:'files',
            key:'id'
          },
          onUpdate:'CASCADE',
          onDelete:'SET NULL'
        },
        canceled_at:{
          type:Sequelize.DATE,
        },
        created_at:{
          type:Sequelize.DATE,
          allowNull:false,
        },
        updated_at:{
          type:Sequelize.DATE,
          allowNull:false
        }
      });
  
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.dropTable('meetups');
    
  }
};
