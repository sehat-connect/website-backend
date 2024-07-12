'use strict';

const modelName                 = 'Home';
const Joi                       = require('joi');
const { AboutValuesModel,
    CommunityModel,
    AboutHeadingModel,
    AboutHeritageModel,
    MenuModel }        = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');



const createHeading = async (req,res,next) => {

    let aboutHeading = await FILE_UPLOAD.uploadMultipleFile(req);
    aboutHeading.active  = true;
    try {
        const schema = Joi.object({
            title            : Joi.string().trim(),
            description      : Joi.string().trim().empty(),
            relatedTitle    : Joi.string().trim().empty(''),
            relatedDescription      : Joi.string().trim().empty(''),
            shareTitle     : Joi.string().trim().empty(''),
            shareDescription            : Joi.string().trim().empty(''),
            topTitle      : Joi.string().trim().empty(''),
            topDescription    : Joi.string().trim().empty(''),
  
            active              : Joi.boolean(),
            files: Joi.array(),

        })
        const {error} = schema.validate(aboutHeading);
        if (error) return res.status(400).json({ error });
              
        let files = aboutHeading.files;
      
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'file'){
                    aboutHeading.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
                }
           
             
           });
        } else delete aboutHeading.files;


        aboutHeading.createdBy = req.user.id;
        aboutHeading.updatedBy = req.user.id;
    
        aboutHeading = await AboutHeadingModel.create(aboutHeading);
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: aboutHeading
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
const getHeading = async(req,res,next) => {
    try {
        let query = req.query;
        let response = await AboutHeadingModel.findAndCountAll({
            attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt'] },
            where: query,
        })
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: response
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
const updateHeading = async(req,res,next) =>{
    try {
        if (!req.params.id) return res.status(400).json({ error: "Heading id is required" });
        let aboutHeading = await FILE_UPLOAD.uploadMultipleFile(req);

        const schema = Joi.object({
            title            : Joi.string().trim(),
            description      : Joi.string().trim().empty(),
            relatedTitle    : Joi.string().trim().empty(''),
            relatedDescription      : Joi.string().trim().empty(''),
            shareTitle     : Joi.string().trim().empty(''),
            shareDescription            : Joi.string().trim().empty(''),
            topTitle      : Joi.string().trim().empty(''),
            topDescription    : Joi.string().trim().empty(''),
  
            active              : Joi.boolean(),
            files: Joi.array(),
        })
        const {error} = schema.validate(aboutHeading);
        if (error) return res.status(400).json({ error });
        let files = aboutHeading.files;
          
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'file'){
                    aboutHeading.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
                }
           });
        } else delete aboutHeading.files;

        aboutHeading.updatedBy = req.user.id;
        aboutHeading = await AboutHeadingModel.update(aboutHeading, { where: { id: req.params.id } });
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: aboutHeading
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

        await AboutHeadingModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Heading deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const getData = async(req,res,next) => {
    try {
        let query = req.query; 
        let data = {}; 
         data.heading = await AboutHeadingModel.findOne({
            attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt','id'] },
            where: {active:true},
        })

        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
         query.active = true;


        data.communityList = await CommunityModel.findAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :query,
            order:[['sortOrder','DESC']],
            offset: offset,
            limit: limit,
        })

        data.meta = await MenuModel.findOne({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :{link:'about'},
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
    getData,
    remove
};