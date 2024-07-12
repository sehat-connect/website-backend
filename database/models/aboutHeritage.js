'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const HeritageSchema = sequelize.define('tbl_aboutheritage', {
    description: { type: DataTypes.TEXT('long'),allowNull: true},
    hindi_description: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_description: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_description: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_description: { type: DataTypes.TEXT('long'), allowNull: true },
    year:{type:DataTypes.INTEGER,allowNull:true},
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = HeritageSchema;
