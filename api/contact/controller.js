'use strict';

const modelName                 = 'Faq';
const Joi                       = require('joi');
const { 
    
    EnquiryModel,MenuModel }           = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');


const createEnquiry = async (req,res, next) => {
    let result = req.body || {}

    try {
        const schema = Joi.object({
            firstName :Joi.string().required().trim(),
            lastName :Joi.string().required().trim(),
            phone :Joi.number(),
            email: Joi.string().required().trim(),
            communityId: Joi.number(),
            message: Joi.string().trim(),
         
        })
        const { error } = schema.validate(result);
        if (error) return res.status(400).json({ error });
      
        result     = await EnquiryModel.create(result);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: result
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getEnquiry = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
        
        let response = await EnquiryModel.findAndCountAll({
            attributes: {exclude: ['createdAt','updatedAt']},
            where :query,
            order:[['id','DESC']],
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



const removeEnquiry = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await EnquiryModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Record deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};



const getData = async(req,res,next) => {
    try {
        let query = req.query;
       
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let data = {}; 

        delete query.offset;
        delete query.limit;
         query.active = true;
         data.meta = await MenuModel.findOne({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {link:'contact'},
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
    createEnquiry,
    getEnquiry,
    removeEnquiry,
    getData
};