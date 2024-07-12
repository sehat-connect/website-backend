'use strict';

const modelName                 = 'Faq';
const Joi                       = require('joi');
const { FaqModel,
    FaqHeadingModel,
    HomePartnerModel }           = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');


const create = async (req,res, next) => {
    let faq = req.body || {}
        faq.active = true;
    try {
        const schema = Joi.object({
                faqHeadingId :Joi.number().required(),
                title :Joi.string().required().trim(),
                description :Joi.string().trim(),
                hindi_title: Joi.string().required().trim(),
                hindi_description: Joi.string().trim(),
                marathi_title: Joi.string().required().trim(),
                marathi_description: Joi.string().trim(),
                tamil_title: Joi.string().required().trim(),
                tamil_description: Joi.string().trim(),
                telegu_title: Joi.string().required().trim(),
                telegu_description: Joi.string().trim(),
                sortOrder :Joi.number(),
                active :Joi.boolean()
        })
        const { error } = schema.validate(faq);
        if (error) return res.status(400).json({ error });
      
        faq.createdBy = req.user.id;
        faq.updatedBy = req.user.id;

        faq     = await FaqModel.create(faq);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: faq
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await FaqModel.findAndCountAll({
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

const update = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "faq id is required"});
        let faq = req.body || {}
        const schema = Joi.object({
            faqHeadingId :Joi.number().required(),
            title :Joi.string().required().trim(),
            description :Joi.string().trim(),
            hindi_title: Joi.string().required().trim(),
            hindi_description: Joi.string().trim(),
            marathi_title: Joi.string().required().trim(),
            marathi_description: Joi.string().trim(),
            tamil_title: Joi.string().required().trim(),
            tamil_description: Joi.string().trim(),
            telegu_title: Joi.string().required().trim(),
            telegu_description: Joi.string().trim(),
            sortOrder :Joi.number(),
            active :Joi.boolean()
    })
    const { error } = schema.validate(faq);
    if (error) return res.status(400).json({ error });

    faq.updatedBy = req.user.id;
 
    faq           = await FaqModel.update(faq,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "faq updated successfully"
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

        await FaqModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "faq deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createFaqHeading = async (req,res, next) => {
    let faq = req.body || {}
        faq.active = true;
    try {
        const schema = Joi.object({
            title :Joi.string().required().trim(),
            hindi_title: Joi.string().required().trim(),
            marathi_title: Joi.string().required().trim(),
            tamil_title: Joi.string().required().trim(),
            telegu_title: Joi.string().required().trim(),
            sortOrder :Joi.number(),
            active :Joi.boolean()
        })
        const { error } = schema.validate(faq);
        if (error) return res.status(400).json({ error });
      
        faq.createdBy = req.user.id;
        faq.updatedBy = req.user.id;

        faq     = await FaqHeadingModel.create(faq);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: faq
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getFaqHeading = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await FaqHeadingModel.findAndCountAll({
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

const updateFaqHeading = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "faq heading id is required"});
        let faq = req.body || {}
        const schema = Joi.object({
            title :Joi.string().required().trim(),
            hindi_title: Joi.string().required().trim(),
            marathi_title: Joi.string().required().trim(),
            tamil_title: Joi.string().required().trim(),
            telegu_title: Joi.string().required().trim(),
            sortOrder :Joi.number(),
            active :Joi.boolean()
    })
    const { error } = schema.validate(faq);
    if (error) return res.status(400).json({ error });

    faq.updatedBy = req.user.id;
 
    faq           = await FaqHeadingModel.update(faq,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "faq heading updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const getData = async(req,res,next) => {
    try {
        let query = req.query;
       
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let data = {}; 

        delete query.offset;
        delete query.limit;
         query.active = true;
         data.allFaq = await FaqModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true},
            order:[['sortOrder','ASC']],
            offset: offset,
            limit: limit,
        })
        data.allfaqHeading = await FaqHeadingModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: query,
            order:[['sortOrder','ASC']],
            offset: offset,
            limit: limit,
        })
        data.partnerList = await HomePartnerModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true},
            order:[['sortOrder','ASC']]
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
    create,
    get,
    update,
    remove,
    createFaqHeading,
    getFaqHeading,
    updateFaqHeading,
    getData
};