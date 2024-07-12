'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const PageSchema = sequelize.define('tbl_page', {
   
    description: { type: DataTypes.TEXT('long'),allowNull: true},
    hindi_description: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_description: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_description: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_description: { type: DataTypes.TEXT('long'), allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = PageSchema;
