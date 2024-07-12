'use strict';
const { Sequelize, DataTypes }  = require("sequelize");
const sequelize                 = require('@lib/sequelize');

const NewsSchema = sequelize.define('tbl_news', {
    title: { type: DataTypes.STRING, allowNull: true },
    hindi_title: { type: DataTypes.STRING, allowNull: true },
    marathi_title: { type: DataTypes.STRING, allowNull: true },
    tamil_title: { type: DataTypes.STRING, allowNull: true },
    telegu_title: { type: DataTypes.STRING, allowNull: true },

    slug: { type: DataTypes.STRING, allowNull: true },
    shortDescription: { type: DataTypes.STRING },
    hindi_shortDescription: { type: DataTypes.STRING, allowNull: true },
    marathi_shortDescription: { type: DataTypes.STRING, allowNull: true },
    tamil_shortDescription: { type: DataTypes.STRING, allowNull: true },
    telegu_shortDescription: { type: DataTypes.STRING, allowNull: true },
    
    description: { type: DataTypes.TEXT('long')},
    hindi_description: { type: DataTypes.TEXT('long')},
    marathi_description: { type: DataTypes.TEXT('long')},
    tamil_description: { type: DataTypes.TEXT('long')},
    telegu_description: { type: DataTypes.TEXT('long')},
    metaTag: { type: DataTypes.STRING},
    metaTitle: { type: DataTypes.STRING},
    metaDescription: { type: DataTypes.TEXT('long')},
    publishDate: { type: DataTypes.STRING, allowNull: true },
    sortOrder:{type:DataTypes.INTEGER,allowNull:true},
    showOnTop:{type:DataTypes.INTEGER,allowNull:true},
    file: { type: DataTypes.STRING, defaultValue: null },
    thumbnail: { type: DataTypes.STRING, defaultValue: null },
    createdBy:{type:DataTypes.INTEGER,allowNull:true},
    updatedBy:{type:DataTypes.INTEGER,allowNull:true},
    showOnHome: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    active: { type: DataTypes.BOOLEAN, allowNull: true }
}, {
    // Other model options go here
}); 

 
module.exports = NewsSchema;
