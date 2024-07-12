"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("@lib/sequelize");

const SubscriptionsSchema = sequelize.define(
    "tbl_subscriptions",
    {
        user_id: { type: DataTypes.NUMBER, allowNull: false },
        abha_address: { type: DataTypes.STRING, allowNull: false },
        abha_number: { type: DataTypes.STRING, allowNull: true },
        subscription_id: { type: DataTypes.TEXT("long"), allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
        // Other model options go here
    }
);

module.exports = SubscriptionsSchema;
