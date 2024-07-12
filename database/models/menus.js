'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const MenusSchema = sequelize.define('tbl_front_menu', {
    title: { type: DataTypes.STRING},
    title1: { type: DataTypes.STRING, allowNull: true },
    title2: { type: DataTypes.STRING, allowNull: true },
 
    menuName: { type: DataTypes.STRING},
   
    description: { type: DataTypes.TEXT('long')},
    description1: { type: DataTypes.TEXT('long'), allowNull: true },
    description2: { type: DataTypes.TEXT('long'), allowNull: true },
    
    link: { type: DataTypes.STRING},
    metaTag: { type: DataTypes.STRING},
    metaTitle: { type: DataTypes.STRING},
    metaDescription: { type: DataTypes.STRING},
    file: { type: DataTypes.STRING, defaultValue: null },
    image2: { type: DataTypes.STRING, defaultValue: null },
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    
}, {
    // Other model options go here
}); 


module.exports = MenusSchema;
