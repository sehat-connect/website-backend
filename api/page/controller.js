'use strict';

const modelName                 = 'Page';
const Joi                       = require('joi');
const { 
    PageModel,
    HomePartnerModel }         = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');


const create = async (req,res, next) => {
    let page = req.body;
        page.active = true;
    try {
        const schema = Joi.object({
                description: Joi.string().required(),
                hindi_description: Joi.string().required(),
                marathi_description: Joi.string().required(),
                tamil_description: Joi.string().required(),
                telegu_description: Joi.string().required(),
                active           : Joi.boolean()
        })
        const { error } = schema.validate(page);
        if (error) return res.status(400).json({ error });
      
      
        page.createdBy = req.user.id;
        page.updatedBy = req.user.id;

        page           = await PageModel.create(page);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: page
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
 
        let response = await PageModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :query,
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
        if (!req.params.id) return res.status(400).json({error: "page id is required"});
        let page = req.body;
        const schema = Joi.object({
                description: Joi.string().required(),
                hindi_description: Joi.string().required(),
                marathi_description: Joi.string().required(),
                tamil_description: Joi.string().required(),
                telegu_description: Joi.string().required(),
                active           : Joi.boolean()
    })
    const { error } = schema.validate(page);
    if (error) return res.status(400).json({ error });
  
   
    page.updatedBy = req.user.id;
    page           = await PageModel.update(page,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "page updated successfully"
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

        await PageModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "page deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const getData = async(req,res,next) => {
    try {
        let query = req.query;
        let data = {}; 
        query.active = true;

       
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
        
     
        data.allpage = await PageModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true},
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