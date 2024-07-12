'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');
const { FileModel }             = require('@database');

const AbhaHeadingSchema = sequelize.define('tbl_abhaheading', {
    title: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT('long'), allowNull: true },
    benafitTitle: { type: DataTypes.STRING, allowNull: true },
    benafitDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    participateTitle: { type: DataTypes.STRING, allowNull: true },
    participateDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    benafits:{ type: DataTypes.TEXT('long'), allowNull: true },
    image1: { type: DataTypes.STRING, allowNull: true },    
    image2: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = AbhaHeadingSchema;
