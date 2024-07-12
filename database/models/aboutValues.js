'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const AboutValuesSchema = sequelize.define('tbl_aboutvalues', {
    title: { type: DataTypes.STRING,allowNull: true},
    hindi_title: { type: DataTypes.STRING, allowNull: true },
    marathi_title: { type: DataTypes.STRING, allowNull: true },
    tamil_title: { type: DataTypes.STRING, allowNull: true },
    telegu_title: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT('long'),allowNull: true},
    hindi_description: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_description: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_description: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_description: { type: DataTypes.TEXT('long'), allowNull: true },
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    file: { type: DataTypes.STRING, defaultValue: null },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = AboutValuesSchema;
