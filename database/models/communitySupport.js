'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const CommunityPostsSupportschema = sequelize.define('tbl_community_post_supports', {
 
    userId: { type: DataTypes.NUMBER, allowNull: false },
    communityPostId: { type: DataTypes.NUMBER, allowNull: false },
    total: { type: DataTypes.NUMBER,allowNull: true},
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = CommunityPostsSupportschema;
