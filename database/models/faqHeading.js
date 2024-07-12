'use strict';
const { DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');


const FaqHeadingSchema = sequelize.define('tbl_faq_heading', {
    title: { type: DataTypes.STRING, allowNull: true },
    hindi_title: { type: DataTypes.STRING, allowNull: true },
    marathi_title: { type: DataTypes.STRING, allowNull: true },
    tamil_title: { type: DataTypes.STRING, allowNull: true },
    telegu_title: { type: DataTypes.STRING, allowNull: true },
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = FaqHeadingSchema;
