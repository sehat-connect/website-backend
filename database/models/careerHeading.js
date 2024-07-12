'use strict';
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('@lib/sequelize');

const CareerHeadingSchema = sequelize.define('tbl_career_heading', {
    heading1: { type: DataTypes.STRING, allowNull: true },
    hindi_heading1: { type: DataTypes.STRING, allowNull: true },
    marathi_heading1: { type: DataTypes.STRING, allowNull: true },
    tamil_heading1: { type: DataTypes.STRING, allowNull: true },
    telegu_heading1: { type: DataTypes.STRING, allowNull: true },

    description1: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_description1: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_description1: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_description1: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_description1: { type: DataTypes.TEXT('long'), allowNull: true },

    youtube_link: { type: DataTypes.TEXT('long'), allowNull: true },

    heading2: { type: DataTypes.STRING, allowNull: true },
    hindi_heading2: { type: DataTypes.STRING, allowNull: true },
    marathi_heading2: { type: DataTypes.STRING, allowNull: true },
    tamil_heading2: { type: DataTypes.STRING, allowNull: true },
    telegu_heading2: { type: DataTypes.STRING, allowNull: true },


    heading3: { type: DataTypes.STRING, allowNull: true },
    hindi_heading3: { type: DataTypes.STRING, allowNull: true },
    marathi_heading3: { type: DataTypes.STRING, allowNull: true },
    tamil_heading3: { type: DataTypes.STRING, allowNull: true },
    telegu_heading3: { type: DataTypes.STRING, allowNull: true },
    description3: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_description3: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_description3: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_description3: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_description3: { type: DataTypes.TEXT('long'), allowNull: true },

    heading4: { type: DataTypes.STRING, allowNull: true },
    hindi_heading4: { type: DataTypes.STRING, allowNull: true },
    marathi_heading4: { type: DataTypes.STRING, allowNull: true },
    tamil_heading4: { type: DataTypes.STRING, allowNull: true },
    telegu_heading4: { type: DataTypes.STRING, allowNull: true },
    description4: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_description4: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_description4: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_description4: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_description4: { type: DataTypes.TEXT('long'), allowNull: true },

    email: { type: DataTypes.STRING, allowNull: true },
    heading5: { type: DataTypes.STRING, allowNull: true },
    hindi_heading5: { type: DataTypes.STRING, allowNull: true },
    marathi_heading5: { type: DataTypes.STRING, allowNull: true },
    tamil_heading5: { type: DataTypes.STRING, allowNull: true },
    telegu_heading5: { type: DataTypes.STRING, allowNull: true },
    file5: { type: DataTypes.STRING, allowNull: true },


    heading6: { type: DataTypes.STRING, allowNull: true },
    hindi_heading6: { type: DataTypes.STRING, allowNull: true },
    marathi_heading6: { type: DataTypes.STRING, allowNull: true },
    tamil_heading6: { type: DataTypes.STRING, allowNull: true },
    telegu_heading6: { type: DataTypes.STRING, allowNull: true },

    name: { type: DataTypes.STRING, allowNull: true },
    hindi_name: { type: DataTypes.STRING, allowNull: true },
    marathi_name: { type: DataTypes.STRING, allowNull: true },
    tamil_name: { type: DataTypes.STRING, allowNull: true },
    telegu_name: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: true },
    hindi_position: { type: DataTypes.STRING, allowNull: true },
    marathi_position: { type: DataTypes.STRING, allowNull: true },
    tamil_position: { type: DataTypes.STRING, allowNull: true },
    telegu_position: { type: DataTypes.STRING, allowNull: true },

    hr_heading: { type: DataTypes.STRING, allowNull: true },
    hindi_hr_heading: { type: DataTypes.STRING, allowNull: true },
    marathi_hr_heading: { type: DataTypes.STRING, allowNull: true },
    tamil_hr_heading: { type: DataTypes.STRING, allowNull: true },
    telegu_hr_heading: { type: DataTypes.STRING, allowNull: true },

    hr_description: { type: DataTypes.TEXT('long'), allowNull: true },
    hindi_hr_description: { type: DataTypes.TEXT('long'), allowNull: true },
    marathi_hr_description: { type: DataTypes.TEXT('long'), allowNull: true },
    tamil_hr_description: { type: DataTypes.TEXT('long'), allowNull: true },
    telegu_hr_description: { type: DataTypes.TEXT('long'), allowNull: true },

    file6: { type: DataTypes.STRING, allowNull: true },

    active: { type: DataTypes.BOOLEAN, allowNull: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true },

}, {
    // Other model options go here
});


module.exports = CareerHeadingSchema;
