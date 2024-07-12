'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const OtpSchema = sequelize.define('tbl_otp', {
    token: { type: DataTypes.STRING,allowNull: false},
    number: { type: DataTypes.STRING, allowNull: false },
    expiry:{type:DataTypes.STRING,allowNull:true},
}, {
    // Other model options go here
}); 


module.exports = OtpSchema;
