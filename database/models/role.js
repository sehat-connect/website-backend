'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const RoleShema = sequelize.define('tbl_roles', {
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.ENUM, allowNull: false,unique: true,values: ['SUPER_ADMIN', 'USER'] },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    description: { type: DataTypes.STRING ,defaultValue: ""},
    active: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
    // Other model options go here
}); 

 
module.exports = RoleShema;
