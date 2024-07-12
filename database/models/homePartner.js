'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const PartnerSchema = sequelize.define('tbl_home_partner', {
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    file: { type: DataTypes.STRING, defaultValue: null },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = PartnerSchema;
