'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const CommunityPostschema = sequelize.define('tbl_community_post', {
 
    message: { type: DataTypes.TEXT('long'),allowNull: false},
    userId: { type: DataTypes.NUMBER, allowNull: false },
    communityId: { type: DataTypes.NUMBER, allowNull: false },
    file: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = CommunityPostschema;
