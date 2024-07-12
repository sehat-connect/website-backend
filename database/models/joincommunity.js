'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const JoinSchema = sequelize.define('tbl_join_community', {

    communityId: { type: DataTypes.STRING, defaultValue: null },
    userId: { type: DataTypes.STRING, defaultValue: null },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = JoinSchema;
