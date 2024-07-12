'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const Communityschema = sequelize.define('tbl_community', {
 
    title: { type: DataTypes.STRING,allowNull: true},
    description: { type: DataTypes.STRING, allowNull: true },
    slug: { type: DataTypes.STRING, allowNull: true },
    symtomsDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    causesDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    sortOrder:{type:DataTypes.NUMBER,allowNull:true},
    file: { type: DataTypes.TEXT('long'), allowNull: true },
    thumbnail: { type: DataTypes.TEXT('long'), allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = Communityschema;
