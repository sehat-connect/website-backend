"use strict";
const Joi = require("joi");
const {
    AutoApprovalsModel,
    LinkedCareContextsModel,
    SubscriptionsModel,
} = require("@database");
const CONSTANT = require("@lib/constant");
const UTILS = require("@lib/utils");

const saveAutoApproval = async (req, res, next) => {
    let autoApproval = req.body || {};
    try {
        const schema = Joi.object({
            user_id: Joi.number().required(),
            abha_address: Joi.string().required(),
            abha_number: Joi.string(),
            auto_approval_id: Joi.string().required(),
            status: Joi.boolean(),
        });
        const { error } = schema.validate(autoApproval);

        if (error) return res.status(400).json({ error });

        autoApproval.user_id = req.user.id;
        autoApproval = await AutoApprovalsModel.create(autoApproval);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            autoApproval: autoApproval,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateAutoApprovalStatus = async (req, res, next) => {
    let autoApproval = req.body || {};

    if (!req.params.id)
        return res.status(400).json({ error: "Id is required" });
    try {
        const schema = Joi.object({
            status: Joi.boolean().required(),
        });
        const { error } = schema.validate(autoApproval);

        if (error) return res.status(400).json({ error });

        autoApproval = await AutoApprovalsModel.update(autoApproval, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            autoApproval: autoApproval,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getAutoApproval = async (req, res, next) => {
    try {
        let autoApproval = await AutoApprovalsModel.findOne({
            where: { abha_address: req.query.abha_address },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            autoApproval: autoApproval,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const saveSubscription = async (req, res, next) => {
    let subscription = req.body || {};
    try {
        const schema = Joi.object({
            user_id: Joi.number().required(),
            abha_address: Joi.string().required(),
            abha_number: Joi.string(),
            subscription_id: Joi.string().required(),
            status: Joi.boolean(),
        });
        const { error } = schema.validate(subscription);

        if (error) return res.status(400).json({ error });

        subscription.user_id = req.user.id;
        subscription = await SubscriptionsModel.create(subscription);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            subscription: subscription,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
const getSubscription = async (req, res, next) => {
    try {
        let subscription = await SubscriptionsModel.findOne({
            where: { abha_address: req.query.abha_address },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            subscription: subscription,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateSubscriptionStatus = async (req, res, next) => {
    let subscription = req.body || {};

    if (!req.params.id)
        return res.status(400).json({ error: "Id is required" });
    try {
        const schema = Joi.object({
            status: Joi.boolean().required(),
        });
        const { error } = schema.validate(subscription);

        if (error) return res.status(400).json({ error });

        subscription = await SubscriptionsModel.update(subscription, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            subscription: subscription,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const saveCareContext = async (req, res, next) => {
    let careContext = req.body || {};
    try {
        const schema = Joi.object().keys({
            user_id: Joi.number().required(),
            abha_address: Joi.string().required(),
            abha_number: Joi.string(),
            facility_id: Joi.string().required(),
            facility_name: Joi.string().required(),
            care_context_reference: Joi.string().required(),
        });
        const schemas = Joi.array().items(schema);
        const { error } = schemas.validate(careContext);

        if (error) return res.status(400).json({ error });

        careContext.user_id = req.user.id;
        careContext = await LinkedCareContextsModel.bulkCreate(careContext);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            careContext: careContext,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getCareContexts = async (req, res, next) => {
    try {
        let careContexts = await LinkedCareContextsModel.findAll({
            where: { abha_address: req.query.abha_address },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            careContexts: careContexts,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    saveAutoApproval,
    updateAutoApprovalStatus,
    getAutoApproval,
    saveSubscription,
    updateSubscriptionStatus,
    getSubscription,
    saveCareContext,
    getCareContexts,
};
