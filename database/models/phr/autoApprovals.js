"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("@lib/sequelize");

const AutoApprovalSchema = sequelize.define(
    "tbl_auto_approvals",
    {
        user_id: { type: DataTypes.NUMBER, allowNull: false },
        abha_address: { type: DataTypes.STRING, allowNull: false },
        abha_number: { type: DataTypes.STRING, allowNull: true },
        auto_approval_id: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
        // Other model options go here
    }
);

module.exports = AutoApprovalSchema;
