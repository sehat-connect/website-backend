'use strict';

const modelName                 = 'Home';
const Joi                       = require('joi');
const { AbhaModel,MenuModel  }        = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');
const { Utils } = require('sequelize');
const { error } = require('console');
const jwt                   = require('jsonwebtoken');
const moment                = require('moment');





const createHeading = async (req,res, next) => {
    let heading = await FILE_UPLOAD.uploadMultipleFile(req);
    heading.active = true;
    try {
        const schema = Joi.object({
                title            : Joi.string().trim(),
                description      : Joi.string().empty('').trim(),
                benafitTitle    : Joi.string().empty('').trim(),
                benafitDescription      : Joi.string().empty('').trim(),
                participateTitle     : Joi.string().empty('').trim(),
                participateDescription      : Joi.string().empty(''),
                benafits                    :Joi.array().empty(''),
                
                files            : Joi.array(),
                active           : Joi.boolean()
        })
        const { error } = schema.validate(heading);
        if (error) return res.status(400).json({ error });

        let files = heading.files;
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    aboutHeading.image1 = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    aboutHeading.image2 = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
                }
           });
        } else delete heading.files;

        heading.benafits = req.body.benafits?JSON.stringify(req.body.benafits):[];
        heading.createdBy = req.user.id;
        heading.updatedBy = req.user.id;

        heading           = await AbhaModel.create(heading);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: heading
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getHeading = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await AbhaModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :query,
            order:[['sortOrder','DESC']],
            offset: offset,
            limit: limit,
        })
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const updateHeading = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "Value id is required"});
        let heading = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title            : Joi.string().trim(),
            description      : Joi.string().empty('').trim(),
            benafitTitle    : Joi.string().empty('').trim(),
            benafitDescription      : Joi.string().empty('').trim(),
            participateTitle     : Joi.string().empty('').trim(),
            participateDescription      : Joi.string().empty(''),
            benafits                    :Joi.array(),
            files            : Joi.array(),
            active           : Joi.boolean()
    })
    const { error } = schema.validate(heading);
    if (error) return res.status(400).json({ error });
  
    let files = heading.files;
    if (files.length) {
        files.forEach((iteam)=>{
            if(iteam.fieldName== 'image1'){
                aboutHeading.image1 = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
            }
            if(iteam.fieldName== 'image2'){
                aboutHeading.image2 = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
            }
       });
    } else delete heading.files;

    heading.benafits = req.body.benafits?JSON.stringify(req.body.benafits):[];
    heading.updatedBy = req.user.id;
 
    heading           = await AbhaModel.update(heading,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "record updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const remove = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await AbhaModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "heading deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


////////////////
const jwtValue = async (req,res)=>{
        let query = req.body||{};
    try{
     
        if(!query) return res.status(200).json(UTILS.errorHandler('value is required'));
        let secretKey = process.env.ABHA_TOKEN,
        duration =  {expiresIn: process.env.TOKEN_EXP_TIME};
        
        query.iat = moment().valueOf();
        
        let token = jwt.sign(query, secretKey, {});
        console.log(token)
       return res.status(200).send({
        status:CONSTANT.REQUESTED_CODES.SUCCESS,
        result:token
       })

    }catch(error){
        return res.status(400).json(UTILS.errorHandler(error));
    }
}



const getData = async(req,res,next) => {
    try {
        let query = req.query;
        let data = {}; 
         data.heading = await AbhaModel.findOne({
            attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt','id'] },
            where: {active:true},
        })

        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
         query.active = true;


        // data.communityList = await CommunityModel.findAll({
        //     attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
        //     where :query,
        //     order:[['sortOrder','DESC']],
        //     offset: offset,
        //     limit: limit,
        // })

        data.meta = await MenuModel.findOne({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :{link:'abha'},
        })
        
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
module.exports = {
    createHeading,
    getHeading,
    updateHeading,
    remove,
    getData,
    jwtValue
};