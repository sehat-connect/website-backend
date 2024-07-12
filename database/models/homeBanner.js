'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const HomeBannerSchema = sequelize.define('tbl_homebanner', {
    title: { type: DataTypes.STRING},
    description: { type: DataTypes.STRING},
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    file: { type: DataTypes.STRING, defaultValue: null },
    mobilefile: { type: DataTypes.STRING, defaultValue: null },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = HomeBannerSchema;
