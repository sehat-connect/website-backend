'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const CitySchema = sequelize.define('tbl_city', {
    stateId:{type:DataTypes.INTEGER,allowNull:true},
    title: { type: DataTypes.STRING,allowNull: true},
    hindi_title: { type: DataTypes.STRING, allowNull: true },
    marathi_title: { type: DataTypes.STRING, allowNull: true },
    tamil_title: { type: DataTypes.STRING, allowNull: true },
    telegu_title: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = CitySchema;
