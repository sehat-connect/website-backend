'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');
const { FileModel }             = require('@database');

const AboutHeadingSchema = sequelize.define('tbl_aboutheading', {
    title: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT('long'), allowNull: true },
    relatedTitle: { type: DataTypes.STRING, allowNull: true },
    relatedDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    shareTitle: { type: DataTypes.STRING, allowNull: true },
    shareDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    topTitle: { type: DataTypes.STRING, allowNull: true },
    topDescription: { type: DataTypes.TEXT('long'), allowNull: true },
   
        
    file: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = AboutHeadingSchema;
