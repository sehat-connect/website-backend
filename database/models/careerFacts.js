'use strict';
const { DataTypes }             = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const CareerFactsSchema = sequelize.define('tbl_career_facts', {
    title: { type: DataTypes.STRING,allowNull: true},
    hindi_title: { type: DataTypes.STRING, allowNull: true },
    marathi_title: { type: DataTypes.STRING, allowNull: true },
    tamil_title: { type: DataTypes.STRING, allowNull: true },
    telegu_title: { type: DataTypes.STRING, allowNull: true },

    value: { type: DataTypes.STRING,allowNull: true},
    short_description: { type: DataTypes.STRING,allowNull: true},
    hindi_short_description: { type: DataTypes.STRING, allowNull: true },
    marathi_short_description: { type: DataTypes.STRING, allowNull: true },
    tamil_short_description: { type: DataTypes.STRING, allowNull: true },
    telegu_short_description: { type: DataTypes.STRING, allowNull: true },
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},

    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = CareerFactsSchema;
