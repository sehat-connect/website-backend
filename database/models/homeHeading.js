'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');
const { FileModel }             = require('@database');

const HomeHeadingSchema = sequelize.define('tbl_homeheading', {
    title: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT('long'), allowNull: true },
    whatTitle: { type: DataTypes.STRING, allowNull: true },
    howTitle: { type: DataTypes.STRING, allowNull: true },
    howDescription: { type: DataTypes.TEXT('long'), allowNull: true },

    participateTitle: { type: DataTypes.STRING, allowNull: true },
    participateDescription: { type: DataTypes.TEXT('long'), allowNull: true },
    healthTitle: { type: DataTypes.STRING, allowNull: true },
    healthDescription: { type: DataTypes.TEXT('long'), allowNull: true },

    video: { type: DataTypes.STRING, defaultValue: null },
    participateImage: { type: DataTypes.STRING, defaultValue: null },
    
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = HomeHeadingSchema;
