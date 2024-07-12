'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');
const { FileModel }             = require('@database');

const TestimonialSchema = sequelize.define('tbl_testimonial', {
    name: { type: DataTypes.STRING, allowNull: true },
    hindi_name: { type: DataTypes.STRING, allowNull: true },
    marathi_name: { type: DataTypes.STRING, allowNull: true },
    tamil_name: { type: DataTypes.STRING, allowNull: true },
    telegu_name: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    hindi_location: { type: DataTypes.STRING, allowNull: true },
    marathi_location: { type: DataTypes.STRING, allowNull: true },
    tamil_location: { type: DataTypes.STRING, allowNull: true },
    telegu_location: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT('long'), allowNull: true },
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


module.exports = TestimonialSchema;
