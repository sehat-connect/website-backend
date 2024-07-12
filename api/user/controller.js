"use strict";

const modelName = "Admin";
const Joi = require("joi");
const {
    UserModel,
    SessionModel,
    RoleModel,
    otpModel,
    CommunityPostModel,
    FileModel,
} = require("@database");
const CONSTANT = require("@lib/constant");
const Auth = require("@middleware/authorization");
const UTILS = require("@lib/utils");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const mail = require("@lib/mailer");
const FILE_UPLOAD = require("@lib/file_upload");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { string } = require("joi");
const http = require("node:http");
const { Op, where } = require("sequelize");
const msg91 = require("msg91").default;
msg91.initialize({ authKey: "413100A3CN8cuMm6638b7e1P1" });

UserModel.belongsTo(RoleModel, { foreignKey: "role", as: "RoleDetail" });

const login = async (req, res, next) => {
    // bcrypt.hash('admin@user', 8, function(err, hash) {
    // console.log(hash)
    // });

    try {
        const schema = Joi.object({
            userName: Joi.string().required().trim(),
            password: Joi.string().required().trim(),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let user = await UserModel.findOne({
            where: { userName: req.body.userName.toLowerCase() },
        });
        if (user === null)
            return res.status(400).send({
                error: `User${
                    CONSTANT.NOT_EXISTS
                }${req.body.userName.toLowerCase()}`,
            });

        let validate = await bcrypt.compare(req.body.password, user.password);
        validate = !validate
            ? CONSTANT.INVALID_CREDENTIALS
            : !user.active
            ? "User" + CONSTANT.INACTIVE
            : null;
        if (validate) return res.status(400).send({ error: validate });
        user = UTILS.cloneObject(user);
        user.token = await Auth.generateJWTToken({
            userId: user.id,
            type: modelName,
        });
        delete user.password;
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: user,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const validateLogin = async (req, res, next) => {
    try {
        return res
            .status(200)
            .send(
                req.user
                    ? { result: { msg: "Token is valid!", status: "success" } }
                    : { error: "Token is not valid!" }
            );
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};
//get Profile Details

const profile = async (req, res, next) => {
    try {
        let user = await UserModel.findOne({
            where: { id: req.user.id, active: true },
            attributes: {
                exclude: [
                    "password",
                    "createdAt",
                    "updatedAt",
                    "active",
                    "role",
                ],
            },
            // include: [{
            //         model: RoleModel,
            //         required: true,
            //         attributes: ['name','code'],
            //         as:'RoleDetail'
            //     }],
            // subQuery: false,
        });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: user,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "id is required" });
        let profile = await FILE_UPLOAD.uploadMultipleFile(req);

        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().empty(""),
            email: Joi.string(),
            dob: Joi.string().empty(""),
            gender: Joi.string().empty(""),
            phone: Joi.string(),
            files: Joi.array(),
            //  active:Joi.boolean()
        });

        const { error } = schema.validate(profile);
        if (error) return res.status(400).json({ error });

        let files = profile.files;
        if (files.length) {
            files.forEach((iteam) => {
                if (iteam.fieldName == "file") {
                    profile.photo = files
                        .filter((e) => e.fieldName == "file")
                        .map((file) => file.path)
                        .toString();
                }
            });
        } else delete profile.files;

        if (req.body.email) {
            let checkEmail = await UserModel.findOne({
                where: {
                    id: { [Op.ne]: req.user.id },
                    email: { [Op.eq]: req.body.email },
                },
            });

            if (checkEmail) {
                return res.status(400).send({ error: "Email Already Exits" });
            }
        }

        if (req.body.phone) {
            let checkphone = await UserModel.findOne({
                where: {
                    id: { [Op.ne]: req.user.id },
                    phone: { [Op.eq]: req.body.phone },
                },
            });

            if (checkphone) {
                return res
                    .status(400)
                    .send({ error: "Phone number Already Exits" });
            }
        }

        profile.updatedBy = req.user.id;
        profile = await UserModel.update(profile, {
            where: { id: req.params.id },
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "User updated successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

//update Profile
const uploadProfilePhoto = async (req, res, next) => {
    try {
        let file = ((await FILE_UPLOAD.uploadMultipleFile(req)).files || [])[0];

        if (!file || !file.id)
            return res.status(400).send({ error: "File upload failed" });

        const user = await UserModel.update(
            { photo: file.id },
            { where: { id: req.query.id || req.user.id } }
        );
        if (!user) return res.status(400).send({ error: "User update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: file.path,
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const logout = async (req, res, next) => {
    try {
        let token = (req.headers["authorization"] || "").toString();
        // console.log(token); return false;
        await SessionModel.update(
            { logout: true },
            { where: { token: token, logout: false } }
        );
        return res
            .status(200)
            .send({ result: "logged out successfully!.", status: true });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const sendOtp = async (req, res, next) => {
    try {
        const schema = Joi.object({
            number: Joi.string().required().trim().min(10).max(10),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let otp = await otpModel.findOne({
            where: { number: req.body.number },
        });
        if (otp) otp = UTILS.cloneObject(otp);
        let randomNumber = await UTILS.getRandomNumber();
        const expiryTime = moment().add(10, "m").valueOf();

        if (otp && otp.expiry < moment().valueOf()) {
            await otpModel.update(
                { token: randomNumber, expiry: expiryTime },
                { where: { number: req.body.number } }
            );
        } else if (otp && otp.expiry >= moment().valueOf()) {
            await otpModel.update(
                { token: randomNumber, expiry: expiryTime },
                { where: { number: req.body.number } }
            );
        } else {
            // first time opt send
            otp = {
                token: randomNumber,
                number: req.body.number,
                expiry: expiryTime,
            };
            await otpModel.create(otp);
        }
        let mobile = "+91" + req.body.number;

        // get user name
        let userDetail = await UserModel.findOne({
            where: { phone: req.body.number },
        });
        let username = "User";
        if (userDetail) {
            let first = userDetail.firstName ? userDetail.firstName : "User";
            let last = userDetail.lastName ? " " + userDetail.lastName : "";
            username = first + last;
        }

        // send otp
        let sms = msg91.getSMS();

        // Send SMS
        await sms.send("6638b975d6fc0515d144a823", {
            mobile: mobile,
            var1: username,
            var2: randomNumber,
        });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "OTP send successfully",
        });

        // send otp
        // let request = require('request');
        // let options = {
        // 'method': 'POST',
        // 'url': `https://202e24cd06a2adb8bffc7b9ca64a60766273f41e5dcbc729:5f7970a89d1842ab66962aa5a48141cb79b05031753a2fc6@api.exotel.com/v1/Accounts/indiashelter1/Sms/send?From=ISFCHL&To=${mobile}&Body=Use this code for verifying your mobile number with India Shelter ${randomNumber}&DltEntityId=1201159141940678598&DltTemplateId=1007160957913250942&SmsType=transactional`,
        // 'headers': {
        // }
        // };
        // request(options, function (error, response) {
        //     if(response){
        //         return res.status(200).send({
        //             status:CONSTANT.REQUESTED_CODES.SUCCESS,
        //             result:'OTP send successfully'})
        //     }
        //   if (error) throw new Error(error);
        //  res.status(400).send({status: CONSTANT.REQUESTED_CODES.ERROR,error: e.message});
        // });

        // return res.status(200).send({result:randomNumber});
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const schema = Joi.object({
            number: Joi.string().required().trim().min(10).max(10),
            token: Joi.string().required().trim().min(6).max(6),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let otp = await otpModel.findOne({
            where: { number: req.body.number },
        });

        if (otp == null) {
            return res
                .status(400)
                .send({ error: "OTP Invalid please generate a new otp !" });
        }

        if (otp) otp = UTILS.cloneObject(otp);

        if (otp && otp.expiry < moment().valueOf()) {
            return res.status(400).send({
                error: "OTP valid only for 10 minutes. Request for new token!",
            });
        } else if (otp && otp.token != req.body.token) {
            return res.status(400).send({ error: "Your OTP is not valid!" });
        } else {
            await otpModel.destroy({ where: { number: req.body.number } });
            let randomNumber = await UTILS.getRandomNumber();

            //    bcrypt.hash('password', 8, function(err, hash) {
            //     console.log(hash)
            //     });

            let userDetail = await UserModel.findOne({
                where: { phone: req.body.number.toLowerCase() },
            });
            if (!userDetail) {
                let newUser = {
                    phone: req.body.number,
                    active: true,
                    role: 2,
                };

                await UserModel.create(newUser);
                let user = await UserModel.findOne({
                    where: { phone: req.body.number.toLowerCase() },
                });
                user = UTILS.cloneObject(user);
                user.token = await Auth.generateJWTToken({
                    userId: user.id,
                    type: "USER",
                });
                delete user.password;
                delete user.createdAt;
                delete user.updatedAt;
                delete user.active;
                delete user.role;

                return res.status(200).send({
                    status: CONSTANT.REQUESTED_CODES.SUCCESS,
                    result: "OTP verify successfully",
                    token: user,
                });
            } else if (userDetail) {
                let user = await UserModel.findOne({
                    where: { phone: req.body.number.toLowerCase() },
                });
                if (user === null)
                    return res.status(400).send({
                        error: `User${
                            CONSTANT.NOT_EXISTS
                        }${req.body.number.toLowerCase()}`,
                    });

                // let validate = await bcrypt.compare(req.body.password, user.password);
                let validate = !user.active ? "User" + CONSTANT.INACTIVE : null;
                if (validate) return res.status(400).send({ error: validate });
                user = UTILS.cloneObject(user);
                user.token = await Auth.generateJWTToken({
                    userId: user.id,
                    type: "USER",
                });
                delete user.password;
                delete user.createdAt;
                delete user.updatedAt;
                delete user.active;
                delete user.role;

                return res.status(200).send({
                    status: CONSTANT.REQUESTED_CODES.SUCCESS,
                    result: "OTP verify successfully",
                    token: user,
                });
            }
        }
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const removeProfile = async (req, res, next) => {
    try {
        // const schema = Joi.object({
        //     id: Joi.string().required()
        // });

        // const { error } = schema.validate(req.params);
        let detail = await UserModel.findOne({ where: { id: req.user.id } });
        if (!detail) {
            return res.status(400).send({ error: "User Account Not Found!" });
        }

        await UserModel.destroy({ where: { id: req.user.id } });
        await CommunityPostModel.destroy({ where: { userId: req.user.id } });

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Account deleted successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const sendEmailOtp = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().required().trim(),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let otp = await otpModel.findOne({ where: { number: req.body.email } });
        if (otp) otp = UTILS.cloneObject(otp);
        let randomNumber = await UTILS.getRandomNumber();
        const expiryTime = moment().add(10, "m").valueOf();

        if (otp && otp.expiry < moment().valueOf()) {
            await otpModel.update(
                { token: randomNumber, expiry: expiryTime },
                { where: { number: req.body.email } }
            );
        } else if (otp && otp.expiry >= moment().valueOf()) {
            await otpModel.update(
                { token: randomNumber, expiry: expiryTime },
                { where: { number: req.body.email } }
            );
        } else {
            // first time opt send
            otp = {
                token: randomNumber,
                number: req.body.email,
                expiry: expiryTime,
            };
            await otpModel.create(otp);
        }
        let email = req.body.email;

        // send email otp

        if (email) {
            let compiled = ejs.compile(
                    fs.readFileSync(
                        path.resolve(
                            __dirname,
                            "../../docs/email_templates/emailLogin.ejs"
                        ),
                        "utf8"
                    )
                ),
                dataToCompile = {
                    token: randomNumber,
                };

            await mail.sendMail(
                [process.env.ADMIN_MAIL],
                `Sehat Connect : OTP Notification `,
                compiled(dataToCompile)
            );
        }

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "OTP send successfully",
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const verifyEmailOtp = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().required().trim(),
            token: Joi.string().required().trim().min(6).max(6),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let otp = await otpModel.findOne({ where: { number: req.body.email } });
        if (otp == null) {
            return res
                .status(400)
                .send({ error: "OTP Invalid please generate a new otp !" });
        }

        if (otp) otp = UTILS.cloneObject(otp);

        if (otp && otp.expiry < moment().valueOf()) {
            return res.status(400).send({
                error: "OTP valid only for 10 minutes. Request for new token!",
            });
        } else if (otp && otp.token != req.body.token) {
            return res.status(400).send({ error: "Your OTP is not valid!" });
        } else {
            await otpModel.destroy({ where: { number: req.body.email } });
            let randomNumber = await UTILS.getRandomNumber();

            //    bcrypt.hash('password', 8, function(err, hash) {
            //     console.log(hash)
            //     });

            let userDetail = await UserModel.findOne({
                where: { email: req.body.email.toLowerCase() },
            });
            if (!userDetail) {
                let newUser = {
                    email: req.body.email,
                    active: true,
                    role: 2,
                };

                await UserModel.create(newUser);
                let user = await UserModel.findOne({
                    where: { email: req.body.email.toLowerCase() },
                });
                user = UTILS.cloneObject(user);
                user.token = await Auth.generateJWTToken({
                    userId: user.id,
                    type: "USER",
                });
                delete user.password;

                return res.status(200).send({
                    status: CONSTANT.REQUESTED_CODES.SUCCESS,
                    result: "OTP verify successfully",
                    token: user.token,
                });
            } else if (userDetail) {
                let user = await UserModel.findOne({
                    where: { email: req.body.email.toLowerCase() },
                });
                if (user === null)
                    return res.status(400).send({
                        error: `User${
                            CONSTANT.NOT_EXISTS
                        }${req.body.email.toLowerCase()}`,
                    });

                // let validate = await bcrypt.compare(req.body.password, user.password);
                let validate = !user.active ? "User" + CONSTANT.INACTIVE : null;
                if (validate) return res.status(400).send({ error: validate });
                user = UTILS.cloneObject(user);
                user.token = await Auth.generateJWTToken({
                    userId: user.id,
                    type: "USER",
                });
                delete user.password;
                delete user.createdAt;
                delete user.updatedAt;
                delete user.active;
                delete user.role;
                return res.status(200).send({
                    status: CONSTANT.REQUESTED_CODES.SUCCESS,
                    result: "OTP verify successfully",
                    token: user,
                });
            }
        }
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

// Google registration

const register = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().required().trim(),
            firstName: Joi.string().empty(""),
            lastName: Joi.string().empty(""),
            photo: Joi.string().empty(""),
            dob: Joi.string().empty(""),
            gender: Joi.string().empty(""),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        let userDetail = await UserModel.findOne({
            where: { email: req.body.email.toLowerCase() },
        });
        if (!userDetail) {
            let newUser = {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                photo: req.body.photo,
                dob: req.body.dob,
                gender: req.body.gender,
                active: true,
                role: 2,
            };

            await UserModel.create(newUser);
            let user = await UserModel.findOne({
                where: { email: req.body.email.toLowerCase() },
            });
            user = UTILS.cloneObject(user);
            user.token = await Auth.generateJWTToken({
                userId: user.id,
                type: "USER",
            });
            delete user.password;
            delete user.createdAt;
            delete user.updatedAt;
            delete user.active;
            delete user.role;

            return res.status(200).send({
                status: CONSTANT.REQUESTED_CODES.SUCCESS,
                result: "Registration successfully",
                token: user,
            });
        } else if (userDetail) {
            let user = await UserModel.findOne({
                where: { email: req.body.email.toLowerCase() },
            });
            if (user === null)
                return res.status(400).send({
                    error: `User${
                        CONSTANT.NOT_EXISTS
                    }${req.body.email.toLowerCase()}`,
                });

            // let validate = await bcrypt.compare(req.body.password, user.password);
            let validate = !user.active ? "User" + CONSTANT.INACTIVE : null;
            if (validate) return res.status(400).send({ error: validate });
            user = UTILS.cloneObject(user);
            user.token = await Auth.generateJWTToken({
                userId: user.id,
                type: "USER",
            });
            delete user.password;
            delete user.createdAt;
            delete user.updatedAt;
            delete user.active;
            delete user.role;

            return res.status(200).send({
                status: CONSTANT.REQUESTED_CODES.SUCCESS,
                token: user,
            });
        }
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const checkToken = async (req, res, next) => {
    try {
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: req.user,
        });
    } catch (error) {
        return res.status(401).send({
            status: CONSTANT.REQUESTED_CODES.ERROR,
            result: "401 Unauthorized",
        });
    }
};

module.exports = {
    login,
    uploadProfilePhoto,
    profile,
    validateLogin,
    logout,
    sendOtp,
    verifyOtp,
    updateProfile,
    removeProfile,
    sendEmailOtp,
    verifyEmailOtp,
    register,
    checkToken,
};
