"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("@lib/sequelize");

const LinkedCareContextsSchema = sequelize.define(
    "tbl_linked_care_contexts",
    {
        user_id: { type: DataTypes.NUMBER, allowNull: false },
        abha_address: { type: DataTypes.STRING, allowNull: false },
        abha_number: { type: DataTypes.STRING, allowNull: true },
        facility_id: { type: DataTypes.STRING, allowNull: false },
        facility_name: { type: DataTypes.STRING, allowNull: false },
        care_context_reference: { type: DataTypes.STRING, allowNull: false },
    },
    {
        // Other model options go here
    }
);

module.exports = LinkedCareContextsSchema;
