'use strict';

const modelName                 = 'News';
const Joi                       = require('joi');
const { NewsModel,
    HomePartnerModel }          = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');

const create = async (req,res, next) => {
    let news = await FILE_UPLOAD.uploadMultipleFile(req);
        news.active = true;
    try {
        const schema = Joi.object({
                title :Joi.string().required().trim(),
                slug :Joi.string(),
                shortDescription :Joi.string().trim(),
                description :Joi.string().trim(),
                publishDate :Joi.string().trim(),
                sortOrder :Joi.number(),
                files: Joi.array(),
                metaTag: Joi.string().empty(''),
                metaTitle: Joi.string().empty(''),
                metaDescription: Joi.string().empty(''),
                showOnHome :Joi.boolean(),
                showOnTop :Joi.boolean(),
                active :Joi.boolean()
        })
        const { error } = schema.validate(news);
        if (error) return res.status(400).json({ error });
      
        let files = news.files;
      
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'file'){
                    news.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'thumbnail'){
                    news.thumbnail = files.filter(e => e.fieldName == 'thumbnail').map(file => file.path).toString(); 
                }
           });
        } else delete news.files;


        news.createdBy = req.user.id;
        news.updatedBy = req.user.id;
        news.slug   = slug(req.body.title);
        
        news        = await NewsModel.create(news);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: news
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async(req,res,next)=>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
        let response = await NewsModel.findAndCountAll({
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


const update = async(req,res,next)=>{
    try {
        if (!req.params.id) return res.status(400).json({error: "news id is required"});
        let news = await FILE_UPLOAD.uploadMultipleFile(req);
        
            const schema = Joi.object({
                    title :Joi.string().required().trim(),
                    slug :Joi.string(),
                    shortDescription :Joi.string().trim(),
                    description :Joi.string().trim(),
                    publishDate :Joi.string().trim(),
                    sortOrder :Joi.number(),
                    files: Joi.array(),
                    metaTag: Joi.string().empty(''),
                    metaTitle: Joi.string().empty(''),
                    metaDescription: Joi.string().empty(''),
                    showOnHome :Joi.boolean(),
                    showOnTop :Joi.boolean(),
                    active :Joi.boolean()
            })
            const { error } = schema.validate(news);
            if (error) return res.status(400).json({ error });
          
            let files = news.files;
          
            if (files.length) {
                files.forEach((iteam)=>{
                    if(iteam.fieldName== 'file'){
                        news.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
                    }
                    if(iteam.fieldName== 'thumbnail'){
                        news.thumbnail = files.filter(e => e.fieldName == 'thumbnail').map(file => file.path).toString(); 
                    }
               });
            } else delete news.files;
    
            news.updatedBy = req.user.id;
            news.slug   = slug(req.body.title);
            
            news        = await NewsModel.update(news,{where:{id: req.params.id}});
    
            return res.status(200).send({
                status: CONSTANT.REQUESTED_CODES.SUCCESS,
                result: "News Updated Successfully"
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

        await NewsModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "News deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const getData = async(req,res,next) => {
    try {
        let query = req.query;
        let data = {}; 

        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
         query.active = true;
         data.allTopNews = await NewsModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true,showOnTop:true},
            order:[['sortOrder','ASC']],
            offset: offset,
            limit: limit,
        })
        data.allNews = await NewsModel.findAndCountAll({
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
    getData
};