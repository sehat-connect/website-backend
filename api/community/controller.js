"use strict";

const modelName = "Home";
const Joi = require("joi");
const {
    CommunityModel,
    AboutHeadingModel,
    UserModel,
    CommunityPostModel,
    CommunityPostLikeModel,
    CommunityPostSupportModel,
    CommunityPostApplauseModel,
    CommunityPostReportModel,
    ReplyPostModel,
    CommunityPostHideModel,
    CommunityJoinModel,
    MenuModel,
} = require("@database");
const CONSTANT = require("@lib/constant");
const UTILS = require("@lib/utils");
const FILE_UPLOAD = require("@lib/file_upload");
const slug = require("slug");
const moment = require("moment");
const { DataTypes, Op, where } = require("sequelize");
const sequelize = require("@lib/sequelize");
const { truncate } = require("fs");

const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const mail = require("@lib/mailer");

CommunityPostModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "UserDetail",
});
CommunityPostModel.belongsTo(CommunityModel, {
    foreignKey: "communityId",
    as: "CommunityDetail",
});

CommunityJoinModel.belongsTo(CommunityModel, {
    foreignKey: "communityId",
    as: "CommunityDetail",
});

CommunityPostModel.hasMany(CommunityPostLikeModel, {
    foreignKey: "communityPostId",
});
CommunityPostLikeModel.belongsTo(CommunityPostModel, {
    foreignKey: "communityPostId",
});

CommunityPostModel.hasMany(CommunityPostSupportModel, {
    foreignKey: "communityPostId",
});
CommunityPostSupportModel.belongsTo(CommunityPostModel, {
    foreignKey: "communityPostId",
});
//
CommunityPostModel.hasMany(CommunityPostApplauseModel, {
    foreignKey: "communityPostId",
});
CommunityPostApplauseModel.belongsTo(CommunityPostModel, {
    foreignKey: "communityPostId",
});

CommunityPostModel.hasMany(ReplyPostModel, { foreignKey: "communityPostId" });

ReplyPostModel.belongsTo(UserModel, { foreignKey: "UserId", as: "userDetail" });

CommunityJoinModel.belongsTo(UserModel, { foreignKey: "UserId", as: "userDetail" });

const create = async (req, res, next) => {
    let community = await FILE_UPLOAD.uploadMultipleFile(req);
    community.active = true;
    try {
        const schema = Joi.object({
            title: Joi.string().trim(),
            description: Joi.string().trim().empty(""),
            symtomsDescription: Joi.string().trim().empty(""),
            causesDescription: Joi.string().trim().empty(""),
            slug: Joi.string(),
            sortOrder: Joi.number().empty(""),
            files: Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(community);
        if (error) return res.status(400).json({ error });

        let files = community.files;
        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    community.file = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
                if (iteam.fieldName == "thumbnail") {
                    community.thumbnail = files
                        .filter((e) => e.fieldName == "thumbnail")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete community.files;

        community.slug = req.body.slug
            ? slug(req.body.slug)
            : slug(req.body.title);
        community.createdBy = req.user.id;
        community.updatedBy = req.user.id;

        community = await CommunityModel.create(community);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: community,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const get = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;

        let response = await CommunityModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["sortOrder", "DESC"]],
            offset: offset,
            limit: limit,
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "Value id is required" });
        let community = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title: Joi.string().trim(),
            description: Joi.string().trim().empty(""),
            symtomsDescription: Joi.string().trim().empty(""),
            causesDescription: Joi.string().trim().empty(""),
            sortOrder: Joi.number().empty(""),
            files: Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(community);
        if (error) return res.status(400).json({ error });

        let files = community.files;
        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    community.file = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
                if (iteam.fieldName == "thumbnail") {
                    community.thumbnail = files
                        .filter((e) => e.fieldName == "thumbnail")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete community.files;

        community.slug = req.body.slug
            ? slug(req.body.slug)
            : slug(req.body.title);
        community.updatedBy = req.user.id;

        community = await CommunityModel.update(community, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record updated successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const remove = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CommunityModel.destroy({ where: { id: req.params.id } });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createHeading = async (req, res, next) => {
    let aboutHeading = await FILE_UPLOAD.uploadMultipleFile(req);
    aboutHeading.active = true;
    try {
        const schema = Joi.object({
            title: Joi.string().trim(),
            description: Joi.string().trim().empty(),
            relatedTitle: Joi.string().trim().empty(),
            relatedDescription: Joi.string().trim().empty(),
            shareTitle: Joi.string().trim().empty(),
            shareDescription: Joi.string().trim().empty(),
            topTitle: Joi.string().trim().empty(),
            topDescription: Joi.string().trim().empty(),

            active: Joi.boolean(),
            files: Joi.array(),
        });
        const { error } = schema.validate(aboutHeading);
        if (error) return res.status(400).json({ error });

        let files = aboutHeading.files;

        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    aboutHeading.file = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete aboutHeading.files;

        aboutHeading.createdBy = req.user.id;
        aboutHeading.updatedBy = req.user.id;

        aboutHeading = await AboutHeadingModel.create(aboutHeading);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: aboutHeading,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
const getHeading = async (req, res, next) => {
    try {
        let query = req.query;
        let response = await AboutHeadingModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
const updateHeading = async (req, res, next) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "Heading id is required" });
        let aboutHeading = await FILE_UPLOAD.uploadMultipleFile(req);

        const schema = Joi.object({
            title: Joi.string().trim(),
            description: Joi.string().trim().empty(),
            relatedTitle: Joi.string().trim().empty(),
            relatedDescription: Joi.string().trim().empty(),
            shareTitle: Joi.string().trim().empty(),
            shareDescription: Joi.string().trim().empty(),
            topTitle: Joi.string().trim().empty(),
            topDescription: Joi.string().trim().empty(),

            active: Joi.boolean(),
            files: Joi.array(),
        });
        const { error } = schema.validate(aboutHeading);
        if (error) return res.status(400).json({ error });
        let files = aboutHeading.files;

        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    aboutHeading.file = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete aboutHeading.files;

        aboutHeading.updatedBy = req.user.id;
        aboutHeading = await AboutHeadingModel.update(aboutHeading, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: aboutHeading,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// create post
const createPost = async (req, res, next) => {
    let community = await FILE_UPLOAD.uploadMultipleFile(req);
    community.active = true;

    try {
        const schema = Joi.object({
            communityId: Joi.string().trim().required(),
            message: Joi.string().trim().required(),
            userId: Joi.number(),
            files: Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(community);
        if (error) return res.status(400).json({ error });

        let files = community.files;
        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    community.file = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete community.files;

        community.userId = req.user.id;
community.createdBy = req.user.id;
        community.updatedBy = req.user.id;


        community = await CommunityPostModel.create(community);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: community,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getPost = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;

        query.userId = req.user.id;

        let response = await CommunityPostModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updatePost = async (req, res, next) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "id is required" });
        let community = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            communityId: Joi.string().trim().required(),
            message: Joi.string().trim().required(),
            userId: Joi.number(),
            files: Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(community);
        if (error) return res.status(400).json({ error });

        let files = community.files;
        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    community.file = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete community.files;

        community.updatedBy = req.user.id;
        community.userId = req.user.id;

        community = await CommunityPostModel.update(community, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record updated successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const HidePost = async (req, res, next) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "id is required" });
        let community = req.body || {};

        //     const schema = Joi.object({
        //         id : Joi.number().required(),
        //    })

        // const { error } = schema.validate(community);
        // if (error) return res.status(400).json({ error });

        community.updatedBy = req.user.id;
        community.userId = req.user.id;
        let detail = [];
       
        if (req.user.role == 1) {
             detail = await CommunityPostModel.findOne({
                where: { id: req.params.id},
            });
        } else {
             detail = await CommunityPostModel.findOne({
                where: { id: req.params.id, userId: req.user.id },
            });
        }
       
        if (!detail) {
            return res.status(400).json({ error: "Record not found!" });
        } else {
            community.active = detail.active == true ? false : true;
        }

        community = await CommunityPostModel.update(community, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record updated successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const ReportPost = async (req, res, next) => {
    try {
        let community = req.body || {};
        community.active = true;

        const schema = Joi.object({
            communityPostId: Joi.number().required(),
            userId: Joi.number(),
            files: Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(community);
        if (error) return res.status(400).json({ error });

        community.updatedBy = req.user.id;
        community.userId = req.user.id;

        let checkpost = await CommunityPostModel.findOne({
            where: { id: req.body.communityPostId, userId: req.user.id },
        });
        if (checkpost) {
            return res
                .status(400)
                .json({ error: "You cannot report your own post" });
        }

        let checkAlready = await CommunityPostReportModel.findOne({
            where: {
                communityPostId: req.body.communityPostId,
                userId: req.user.id,
            },
        });
        if (checkAlready) {
            return res.status(200).send({
                status: CONSTANT.REQUESTED_CODES.SUCCESS,
                result: "You Report this post already!",
            });
        }

        community = await CommunityPostReportModel.create(community);

        if (community) {
            let postDetail = await CommunityPostModel.findOne({
                include: [
                    {
                        required: false,
                        model: UserModel,
                        attributes: ["id", "firstName", "lastName", "email"],
                        as: "UserDetail",
                    },
                    {
                        required: false,
                        model: CommunityModel,
                        attributes: ["title"],
                        as: "CommunityDetail",
                    },
                ],

                attributes: [
                    "id",
                    "message",
                    "userId",
                    "communityId",
                    "file",
                    "active",
                    "createdAt",
                ],
                where: { id: req.body.communityPostId },
            });

              if(!postDetail){
                return res.status(400).json({error:'invalid post !'});
            }
            
            let enq = await UserModel.findOne({
                attributes: ["firstName", "lastName", "email", "phone"],
                where: { id: req.user.id },
            });

            let compiled = ejs.compile(
                    fs.readFileSync(
                        path.resolve(
                            __dirname,
                            "../../docs/email_templates/postreport.ejs"
                        ),
                        "utf8"
                    )
                ),
                dataToCompile = {
                    community: postDetail.CommunityDetail.title,
                    post_name: postDetail.message,
                    image: postDetail.file,
                    post_create_user: `${postDetail.UserDetail.firstName} ${postDetail.UserDetail.firstName}`,
                    post_report_by: `${enq.firstName} ${enq.firstName}`,
                    email: enq.email,
                };

            await mail.sendMail(
                [process.env.ADMIN_MAIL],
                `Sehat Connect : Report Notification `,
                compiled(dataToCompile)
            );
        }

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Report submit successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const ReportHide = async (req, res, next) => {
    try {
        let community = req.body || {};
        community.active = true;

        const schema = Joi.object({
            communityPostId: Joi.number().required(),
            userId: Joi.number(),
            files: Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(community);
        if (error) return res.status(400).json({ error });

        community.createdBy = req.user.id;
        community.updatedBy = req.user.id;
        community.userId = req.user.id;

        let detail = await CommunityPostModel.findOne({
            where: { id: req.body.communityPostId, userId: req.user.id },
        });
        if (detail) {
            return res
                .status(400)
                .json({ error: "You cannot hide your own post" });
        }

        let checkAlready = await CommunityPostHideModel.findOne({
            where: {
                communityPostId: req.body.communityPostId,
                userId: req.user.id,
            },
        });
        if (checkAlready) {
            return res.status(200).send({
                status: CONSTANT.REQUESTED_CODES.SUCCESS,
                result: "You Hide this post already!",
            });
        }

        community = await CommunityPostHideModel.create(community);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Hide successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getHideList = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;

        query.userId = req.user.id;

        let response = await CommunityPostHideModel.findAndCountAll({
            attributes: ["communityPostId"],
            where: query,
            // order:[['createdAt','DESC']],
            // offset: offset,
            // limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

////////////

const removePost = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });
        if (req.user.role == 1) {
            await CommunityPostModel.destroy({ where: { id: req.params.id } });
        } else {
            await CommunityPostModel.destroy({
                where: { id: req.params.id, userId: req.user.id },
            });
        }

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

///////////////////

// like post

const createLike = async (req, res, next) => {
    let communityLike = req.body || {};
    communityLike.active = true;

    try {
        const schema = Joi.object({
            communityPostId: Joi.number().required(),
            userId: Joi.number(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(communityLike);
        if (error) return res.status(400).json({ error });

        communityLike.userId = req.user.id;

        let getRecord = await CommunityPostLikeModel.findOne({
            where: {
                communityPostId: communityLike.communityPostId,
                userId: communityLike.userId,
            },
        });

        let getevent = "";

        if (!getRecord) {
            communityLike.createdBy = req.user.id;
            communityLike.updatedBy = req.user.id;
            communityLike = await CommunityPostLikeModel.create(communityLike);
            getevent = 1;
        } else {
            await CommunityPostLikeModel.destroy({
                where: {
                    communityPostId: communityLike.communityPostId,
                    userId: communityLike.userId,
                },
            });
            getevent = 0;
        }

        let totalLIke = await CommunityPostLikeModel.findAll({
            attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "likes"]],
            where: { communityPostId: communityLike.communityPostId },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            event: getevent,
            result: totalLIke,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getLike = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;

        query.userId = req.user.id;

        let response = await CommunityPostLikeModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeLike = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (!req.user.id) {
            return res.status(400).send({ error: "user id is required" });
        }

        await CommunityPostLikeModel.destroy({
            where: { communityPostId: req.params.id, userId: req.user.id },
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

//
// posrt support

const createSupport = async (req, res, next) => {
    let communityLike = req.body || {};
    communityLike.active = true;

    try {
        const schema = Joi.object({
            communityPostId: Joi.number().required(),
            userId: Joi.number(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(communityLike);
        if (error) return res.status(400).json({ error });

        communityLike.userId = req.user.id;

        let getRecord = await CommunityPostSupportModel.findOne({
            where: {
                communityPostId: communityLike.communityPostId,
                userId: communityLike.userId,
            },
        });
        let getevent = "";

        if (!getRecord) {
            communityLike.createdBy = req.user.id;
            communityLike.updatedBy = req.user.id;
            communityLike = await CommunityPostSupportModel.create(
                communityLike
            );
            getevent = 1;
        } else {
            await CommunityPostSupportModel.destroy({
                where: {
                    communityPostId: communityLike.communityPostId,
                    userId: communityLike.userId,
                },
            });
            getevent = 0;
        }

        let result = await CommunityPostSupportModel.findAll({
            attributes: [
                [sequelize.fn("COUNT", sequelize.col("id")), "Support"],
            ],
            where: { communityPostId: communityLike.communityPostId },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            event: getevent,
            result: result,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getSupport = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;
        query.userId = req.user.id;
        let response = await CommunityPostSupportModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeSupport = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (!req.user.id) {
            return res.status(400).send({ error: "user id is required" });
        }

        await CommunityPostSupportModel.destroy({
            where: { communityPostId: req.params.id, userId: req.user.id },
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// createApplause

const createApplause = async (req, res, next) => {
    let communityLike = req.body || {};
    communityLike.active = true;

    try {
        const schema = Joi.object({
            communityPostId: Joi.number().required(),
            userId: Joi.number(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(communityLike);
        if (error) return res.status(400).json({ error });

        communityLike.userId = req.user.id;

        let getRecord = await CommunityPostApplauseModel.findOne({
            where: {
                communityPostId: communityLike.communityPostId,
                userId: communityLike.userId,
            },
        });

        let getevent = "";

        if (!getRecord) {
            communityLike.createdBy = req.user.id;
            communityLike.updatedBy = req.user.id;
            communityLike = await CommunityPostApplauseModel.create(
                communityLike
            );
            getevent = 1;
        } else {
            await CommunityPostApplauseModel.destroy({
                where: {
                    communityPostId: communityLike.communityPostId,
                    userId: communityLike.userId,
                },
            });
            getevent = 0;
        }

        let result = await CommunityPostApplauseModel.findAll({
            attributes: [
                [sequelize.fn("COUNT", sequelize.col("id")), "Applause"],
            ],
            where: { communityPostId: communityLike.communityPostId },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            event: getevent,
            result: result,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getApplause = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;
        query.userId = req.user.id;
        let response = await CommunityPostApplauseModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeApplause = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (!req.user.id) {
            return res.status(400).send({ error: "user id is required" });
        }

        await CommunityPostApplauseModel.destroy({
            where: { communityPostId: req.params.id, userId: req.user.id },
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

/////////////

const createPostReplay = async (req, res, next) => {
    let reply = req.body || {};
    reply.active = true;

    try {
        const schema = Joi.object({
            communityPostId: Joi.number().required(),
            message: Joi.string().trim().required(),
            userId: Joi.number(),
            replyId: Joi.number(),
            // files        : Joi.array(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(reply);
        if (error) return res.status(400).json({ error });

        reply.userId = req.user.id;
        reply.createdBy = req.user.id;
        reply.updatedBy = req.user.id;

        reply = await ReplyPostModel.create(reply);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: reply,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getReplay = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;

        query.userId = req.user.id;

        let response = await ReplyPostModel.findAndCountAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeReplay = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (!req.user.id) {
            return res.status(400).send({ error: "user id is required" });
        }

        await ReplyPostModel.destroy({
            where: { communityPostId: req.params.id, userId: req.user.id },
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// page data

const getData = async (req, res, next) => {
    try {
        let query = req.query;
        let data = {};

        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );

        delete query.offset;
        delete query.limit;
        query.active = true;
        query.type = "JOINED";
        data.JoinCommunityList = await CommunityModel.findAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["sortOrder", "DESC"]],
            offset: offset,
            limit: limit,
        });

        delete query.type;
        data.AllCommunityList = await CommunityModel.findAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: query,
            order: [["sortOrder", "DESC"]],
            offset: offset,
            limit: limit,
        });

        data.meta = await MenuModel.findOne({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: { link: "community" },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const searchData = async (req, res, next) => {
    try {
        let query = req.query;
        let data = {};

        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );

        delete query.offset;
        delete query.limit;
        query.active = true;

        data = await CommunityModel.findAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: {
                title: { [Op.substring]: req.query.keyword },
            },
            order: [["title", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// page data

const communityPostList = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;
        let data = {};

        data.AllCommunityList = await CommunityModel.findAll({
            attributes: {
                exclude: ["createdBy", "updatedBy", "createdAt", "updatedAt"],
            },
            where: { active: true },
            order: [["sortOrder", "DESC"]],
            offset: offset,
            limit: limit,
        });

        if (req.query.slug) {
            let communityDetail = await CommunityModel.findOne({
                where: { slug: req.query.slug, active: true },
                attributes: {
                    exclude: [
                        "createdBy",
                        "updatedBy",
                        "createdAt",
                        "updatedAt",
                        "type",
                    ],
                },
            });

            if (!communityDetail) {
                return res.status(200).send({ error: "record not found" });
            }
            query.communityId = communityDetail.id;
            data.communityDetail = communityDetail;
            delete query.slug;

            data.totalMember = await CommunityJoinModel.findAll({
                attributes: [
                    [sequelize.fn("COUNT", sequelize.col("id")), "total"],
                ],
                where: { communityId: communityDetail.id },
            });
        }

        let sortBy = req.query.sort;
        delete query.sort;
        query.active = true;

        let allPostList = await CommunityPostModel.findAll({
            include: [
                {
                    model: CommunityModel,
                    attributes: ["title", "slug", "file"],
                    as: "CommunityDetail",
                },
                {
                    model: UserModel,
                    attributes: ["id", "firstName", "lastName", "photo"],
                    as: "UserDetail",
                },
                {
                    required: false,
                    model: CommunityPostLikeModel,
                    attributes: ["id"],
                    // order:[['createdAt','desc']],
                },
                {
                    required: false,
                    model: CommunityPostSupportModel,
                    attributes: ["id"],
                    // order:[['createdAt','desc']],
                },
                {
                    required: false,
                    model: CommunityPostApplauseModel,
                    attributes: ["id"],
                    // order:[['createdAt','desc']],
                },
                {
                    required: false,
                    model: ReplyPostModel,
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "createdBy",
                            "updatedBy",
                        ],
                    },
                    order: [["id", "desc"]],
                    include: {
                        model: UserModel,
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "userName",
                            "photo",
                        ],
                        as: "userDetail",
                    },
                    where: { active: true },
                },
            ],

            attributes: [
                "id",
                "message",
                "userId",
                "communityId",
                "file",
                "active",
                "createdAt",
            ],
            where: query,
            order: [["createdAt", "desc"]],
            offset: offset,
            limit: limit,
        });

        allPostList = allPostList.map((post) => {
            return {
                id: post.id,
                message: post.message,
                // userId: post.userId,
                // communityId: post.communityId,
                active: post.active,
                file: post.file,
                createdAt: post.createdAt,
                Community: post.CommunityDetail,
                UserDetail: post.UserDetail,
                LikeCount: post.tbl_community_likes.length,
                SupportCount: post.tbl_community_post_supports.length,
                ApplauseCount: post.tbl_community_post_applauses.length,
                ReplyList: post.tbl_community_post_replies,
            };
        });

        if (sortBy == 2) {
            function sortByLikeCount(posts) {
                return posts.sort((a, b) => b.LikeCount - a.LikeCount);
            }
            allPostList = sortByLikeCount(allPostList);
        }

        data.allPostList = allPostList;

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const communityDetail = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;
        let data = {};

        CommunityModel.hasMany(CommunityPostModel, {
            foreignKey: "communityId",
        });

        //    CommunityJoinModel.belongsTo(CommunityModel,{foreignKey:'communityId',as:'CommunityDetail'});

        data.AllCommunityList = await CommunityModel.findAll({
            // include:[
            //     {
            //     required:false,
            //     model: CommunityPostModel,
            //     // as:'postList'
            //     // attributes: []  ,

            //   }
            //  ],
            attributes: {
                exclude: [
                    "createdBy",
                    "updatedBy",
                    "createdAt",
                    "updatedAt",
                    "type",
                ],
            },
            where: { active: true },
            order: [["sortOrder", "ASC"]],
            offset: offset,
            limit: limit,
            // group: ['id'],
        });

        // const postsWithCommentsCount = data.AllCommunityList.map(post => {

        //       return {
        //         id: post.id,
        //         title: post.title,
        //         postLike: post.tbl_community_posts.length
        //       };
        //     });

        //     data.AllCommunityList  =postsWithCommentsCount;

        if (req.query.slug) {
            let communityDetail = await CommunityModel.findOne({
                where: { slug: req.query.slug },
                attributes: {
                    exclude: [
                        "createdBy",
                        "updatedBy",
                        "createdAt",
                        "updatedAt",
                        "type",
                    ],
                },
            });

            if (!communityDetail) {
                return res.status(200).send({ error: "record not found" });
            }
            query.communityId = communityDetail.id;
            data.communityDetail = communityDetail;
            delete query.slug;

            data.totalMember = await CommunityJoinModel.findAll({
                attributes: [
                    [sequelize.fn("COUNT", sequelize.col("id")), "total"],
                ],
                where: { communityId: communityDetail.id },
            });
        }

        // let response = await CommunityPostLikeModel.findAll({
        //     attributes: ['communityPostId', [sequelize.fn('COUNT', sequelize.col('id')), 'countnum']],
        //     group: ['communityPostId']
        //   });

        // console.log(query)

        //  let allPostList = await CommunityPostModel.findAndCountAll({
        //     attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
        //     where :query,
        //     order:[order_by],
        //     offset: offset,
        //     limit: limit,
        //     logging: console.log
        // })
        // data.userDetail = await allPostList.UserModel();

        let sortBy = req.query.sort;
        delete query.sort;

        let allPostList = await CommunityPostModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ["firstName", "lastName", "photo"],
                    as: "UserDetail",
                },
                {
                    required: false,
                    model: CommunityPostLikeModel,
                    order: [["createdAt", "desc"]],
                },
            ],

            attributes: [
                "id",
                "message",
                "userId",
                "communityId",
                "file",
                "active",
                "createdAt",
            ],
            where: query,
            order: [["createdAt", "desc"]],
            offset: offset,
            limit: limit,
        });

        allPostList = allPostList.map((post) => {
            return {
                id: post.id,
                message: post.message,
                // userId: post.userId,
                // communityId: post.communityId,
                file: post.file,
                UserDetail: post.UserDetail,
                LikeCount: post.tbl_community_likes.length,
            };
        });

        if (sortBy == 2) {
            function sortByLikeCount(posts) {
                return posts.sort((a, b) => b.LikeCount - a.LikeCount);
            }
            allPostList = sortByLikeCount(allPostList);
        }

        data.allPostList = allPostList;

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const likeCount = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;

        let data = await ReplyPostModel.findAll({
            // attributes: [ [sequelize.fn('COUNT', sequelize.col('id')), 'likes']],
            where: query,
            // group:['replyId']
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createJoinCommunity = async (req, res, next) => {
    let join = req.body || {};
    join.active = true;

    try {
        const schema = Joi.object({
            communityId: Joi.number().required(),
            userId: Joi.number(),
            active: Joi.boolean(),
        });
        const { error } = schema.validate(join);
        if (error) return res.status(400).json({ error });

        join.userId = req.user.id;
        let message = "";

        let detail = await CommunityJoinModel.findOne({
            where: { communityId: join.communityId, userId: join.userId },
        });

        if (!detail) {
            join.createdBy = req.user.id;
            join.updatedBy = req.user.id;
            join = await CommunityJoinModel.create(join);
            message = "Community Join successfully";
        } else {
            message = "You have already join this community";
        }
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: message,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeJoinCommunity = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        if (!req.user.id) {
            return res.status(400).send({ error: "user id is required" });
        }

        let detail = await CommunityJoinModel.findOne({
            where: { communityId: req.params.id, userId: req.user.id },
        });
        if (!detail)
            return res
                .status(400)
                .send({ error: "No Join community record found!" });

        await CommunityJoinModel.destroy({
            where: { communityId: req.params.id, userId: req.user.id },
        });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const joinCommunityList = async (req, res, next) => {
    try {
        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        let query = req.query;

        delete query.offset;
        delete query.limit;
        let data = {};
        query.userId = req.user.id;

        data.allJoinCommunity = await CommunityJoinModel.findAndCountAll({
            include: [
                {
                    model: CommunityModel,
                    attributes: ["title", "slug", "thumbnail", "id"],
                    as: "CommunityDetail",
                },
            ],
            attributes: [
                sequelize.fn("COUNT", sequelize.col("userId")),
                "allUser",
            ],
            attributes: {
                exclude: [
                    "createdBy",
                    "updatedBy",
                    "createdAt",
                    "updatedAt",
                    "communityId",
                    "id",
                    "userId",
                ],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            limit: limit,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};




//////////


const getCommunityUser = async (req, res, next) => {
    try {

        let query =  {};

        const  limit = parseInt(
            req.query && req.query.limit?req.query.limit : 10) ;

            const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
        

        delete query.offset;
        delete query.limit;
        let data = {};

        if(req.query.active){
            query.active = req.query.active;
         }

        if(req.query.fromDate && req.query.toDate){
          query.createdAt = {  [Op.between] : [req.query.fromDate , req.query.toDate]};
        
       }else if(req.query.fromDate && !req.query.toDate){
          query.createdAt = {  [Op.substring] : req.query.fromDate};
        }

           
        data.CommunityUser = await CommunityJoinModel.findAndCountAll({
            include: [
                {
                    model: CommunityModel,
                    attributes: ["title", "slug", "thumbnail", "id"],
                    as: "CommunityDetail",
                },
                {
                    model: UserModel,
                    attributes:{exclude:['role','password']},
                    as: "userDetail",
                }
            ],
         
            attributes: {
                exclude: [
                    "createdBy",
                    "updatedBy",
                    "updatedAt",
                    "communityId",
                    "userId"
                ],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            ...(limit==false?'': {limit: limit}),
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



const updateJoinCommunity = async (req, res, next) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "id is required" });
        let community = req.body || {};

        //     const schema = Joi.object({
        //         communityId : Joi.number().required(),
        //    })

        // const { error } = schema.validate(community);
        // if (error) return res.status(400).json({ error });

        community.updatedBy = req.user.id;
        community.userId = req.user.id;

        let detail = await CommunityJoinModel.findOne({
            where: { id: req.params.id},
        });

        if (!detail) {
            return res.status(400).json({ error: "Record not found!" });
        } else {
            community.active = detail.active == true ? false : true;
        }

        community = await CommunityJoinModel.update(community, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record updated successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const DeleteJoinCommunity = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

    
        let detail = await CommunityJoinModel.findOne({
            where: { id: req.params.id},
        });

        if (!detail)
            return res
                .status(400)
                .send({ error: "No Join community record found!" });

        await CommunityJoinModel.destroy({
            where: { id: req.params.id},
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};





const getallPost = async (req, res, next) => {
    try {

        let query =  {};

        const limit = parseInt(
            req.query && req.query.limit ? req.query.limit : 10
        );
        const offset = parseInt(
            req.query && req.query.offset ? req.query.offset : 0
        );
    
        delete query.offset;
        delete query.limit;

        
// sort by poplularty
let popularty = req.query.popularty;
        // if(req.query.popularty){

        //      popularty = await CommunityPostApplauseModel.findAll({
        //         attributes: [
        //           'communityPostId',
        //           [sequelize.fn('COUNT', sequelize.col('communityPostId')), 'applauseCount']
        //         ],
        //         group: ['communityPostId'],
        //         order: [[sequelize.literal('applauseCount'), 'DESC']]
        //       } );

        //       popularty =  popularty.map((iteam)=>{
        //         return iteam.communityPostId;
        //       })
        // }
   
        if(req.query.active){
            query.active = req.query.active;
        }

        if(req.query.fromDate && req.query.toDate){
            query.createdAt = {  [Op.between] : [req.query.fromDate , req.query.toDate]};
        
        }else if(req.query.fromDate && !req.query.toDate){
            query.createdAt = {  [Op.substring] : req.query.fromDate};
        }

        let allPostList = await CommunityPostModel.findAll({
            include:[{
                    model: UserModel,
                    attributes:{exclude:["role","password"]},
                    as: "UserDetail",
            },
            {
            model: CommunityModel,
            attributes:{exclude:["createdBy", "updatedBy", "createdAt", "updatedAt"]},
            as: "CommunityDetail",
            },
            {
                model: CommunityPostApplauseModel,
                attributes: ['id'],
                //   group: ['communityPostId'],
                //   order: [[sequelize.literal('applauseCount'), 'DESC']]
             }      
            
            ],
           
            attributes: {
                exclude: ["createdBy", "updatedBy", "updatedAt","communityId"],
            },
            where: query,
            order: [["createdAt", "DESC"]],
            offset: offset,
            ...(limit==false?'': {limit: limit}),
        });

        allPostList = allPostList.map((post) => {
            return {
                id: post.id,
                message: post.message,
                userId: post.userId,
                file: post.file,
                active: post.active,
                file: post.file,
                createdAt: post.createdAt,
                UserDetail: post.UserDetail,
                CommunityDetail: post.CommunityDetail,
                ApplauseCount: post.tbl_community_post_applauses.length,
            };
        });

        if (popularty == 1) {
            function sortByLikeCount(posts) {
                return posts.sort((a, b) => b.ApplauseCount - a.ApplauseCount);
            }
            allPostList = sortByLikeCount(allPostList);
        }
      

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: allPostList,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



////////

module.exports = {
    create,
    get,
    update,
    remove,
    createHeading,
    getHeading,
    updateHeading,
    getData,
    createPost,
    getPost,
    updatePost,
    removePost,
    createLike,
    getLike,
    removeLike,
    searchData,
    communityPostList,
    createJoinCommunity,
    joinCommunityList,
    likeCount,
    communityDetail,
    createSupport,
    createApplause,
    getSupport,
    removeSupport,
    getApplause,
    removeApplause,
    createPostReplay,
    HidePost,
    ReportPost,
    removeJoinCommunity,
    getReplay,
    removeReplay,
    ReportHide,
    getHideList,
    getCommunityUser,
    updateJoinCommunity,
    DeleteJoinCommunity,
    getallPost
};
