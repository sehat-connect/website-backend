'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');
const bcrypt                    = require('bcryptjs');

const UserSchema = sequelize.define('tbl_user', {
    userName: { type: DataTypes.STRING, allowNull: true},
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, defaultValue: null ,allowNull: true },
    // validate:{isEmail:true}
    email: { type: DataTypes.STRING, allowNull: true, unique: true},
    phone: { type: DataTypes.STRING, allowNull: true, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role:{type:DataTypes.INTEGER,allowNull:false},
    photo: { type: DataTypes.STRING, defaultValue: null },
    dob: { type: DataTypes.STRING,allowNull: true, defaultValue: null },
    gender: { type: DataTypes.STRING,allowNull: true,defaultValue: null },

    active: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
    // Other model options go here
}); 

// UserSchema.beforeCreate(async (user, options) => {
//     const salt = await bcrypt.genSalt(parseInt(process.env.HASH_COST));
//     user.password = await bcrypt.hash(user.password,salt);
//   });

 
module.exports = UserSchema;
