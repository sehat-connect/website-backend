'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const HomeFeatureModel = sequelize.define('tbl_home_feature', {
    title: { type: DataTypes.STRING},
    description: { type: DataTypes.TEXT('long'),allowNull:true},
    link: { type: DataTypes.TEXT('long'),allowNull:true},
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    file: { type: DataTypes.STRING, defaultValue: null },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = HomeFeatureModel;
