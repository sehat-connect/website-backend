'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');
const { FileModel }             = require('@database');

const GrpSchema = sequelize.define('tbl_grp', {
    heading1: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_heading1: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_heading1: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_heading1: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_heading1: { type: DataTypes.TEXT('long'), allowNull: true },

    heading2: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_heading2: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_heading2: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_heading2: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_heading2: { type: DataTypes.TEXT('long'), allowNull: true },
  

    
    heading3: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_heading3: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_heading3: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_heading3: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_heading3: { type: DataTypes.TEXT('long'), allowNull: true },


    heading4: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_heading4: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_heading4: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_heading4: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_heading4: { type: DataTypes.TEXT('long'), allowNull: true },

    heading5: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_heading5: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_heading5: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_heading5: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_heading5: { type: DataTypes.TEXT('long'), allowNull: true },


    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    
}, {
    // Other model options go here
}); 


module.exports = GrpSchema;
