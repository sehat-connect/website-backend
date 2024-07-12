'use strict';
const { DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');


const EnquirySchema = sequelize.define('tbl_contact_enquiry', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false},
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING,allowNull: false},
    communityId: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT('long'),allowNull: true},

    createdAt:{type:DataTypes.INTEGER,allowNull:true},
    updatedAt:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = EnquirySchema;
