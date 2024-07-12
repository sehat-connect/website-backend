'use strict';
const { DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');


const FaqSchema = sequelize.define('tbl_faq', {
    faqHeadingId:{type:DataTypes.INTEGER,allowNull:true},
    title: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT('long')},
    hindi_title: { type: DataTypes.STRING, allowNull: true },
    hindi_description: { type: DataTypes.TEXT('long')},
    marathi_title: { type: DataTypes.STRING, allowNull: true },
    marathi_description: { type: DataTypes.TEXT('long')},
    tamil_title: { type: DataTypes.STRING, allowNull: true },
    tamil_description: { type: DataTypes.TEXT('long')},
    telegu_title: { type: DataTypes.STRING, allowNull: true },
    telegu_description: { type: DataTypes.TEXT('long')},
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = FaqSchema;
