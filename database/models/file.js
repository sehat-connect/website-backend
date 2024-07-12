'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const FileSchema = sequelize.define('tbl_file', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM, allowNull: false,values: ['user'] },
    original: { type: DataTypes.STRING ,allowNull: false},
    path: { type: DataTypes.STRING ,allowNull: false},
    fieldName: { type: DataTypes.STRING ,allowNull: false},
    thumbnail: { type: DataTypes.STRING},
    smallFile: { type: DataTypes.STRING},
    size: { type: DataTypes.STRING ,allowNull: false},
    mimeType: { type: DataTypes.STRING ,allowNull: false},
    description: { type: DataTypes.STRING},
    active: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
    // Other model options go here
}); 

 
module.exports = FileSchema;
