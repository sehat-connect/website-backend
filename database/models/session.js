'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const SessionSchema = sequelize.define('tbl_session', {
    userId: { type: DataTypes.STRING, allowNull: false,unique: true },
    token: { type: DataTypes.STRING, allowNull: false },
    logout: { type: DataTypes.BOOLEAN, allowNull: false ,defaultValue: false}
}, {
    // Other model options go here
}); 

 
module.exports = SessionSchema;
