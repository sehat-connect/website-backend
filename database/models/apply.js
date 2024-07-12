'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const ApplySchema = sequelize.define('tbl_job_apply', {
    name: { type: DataTypes.STRING,allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: true },
    pref_location: { type: DataTypes.STRING, allowNull: true },
    expected_ctc:{type:DataTypes.STRING,allowNull:true},
    current_ctc:{type:DataTypes.STRING,allowNull:true},
    company_name:{type:DataTypes.STRING,allowNull:true},
    designation:{type:DataTypes.STRING,allowNull:true},
    experience:{type:DataTypes.STRING,allowNull:true},
    notice_period:{type:DataTypes.STRING,allowNull:true},
 
    resume: { type: DataTypes.STRING, allowNull:true },
    active: { type: DataTypes.BOOLEAN, allowNull: true },
    
}, {
    // Other model options go here
}); 


module.exports = ApplySchema;
