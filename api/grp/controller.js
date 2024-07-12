'use strict';

const modelName                 = 'GRP';
const Joi                       = require('joi');
const { 
    GrpModel,
    HomePartnerModel }         = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');


const create = async (req,res, next) => {
    let page = req.body;
        page.active = true;
    try {
        const schema = Joi.object({
                heading1: Joi.string(),
                hindi_heading1: Joi.string(),
                marathi_heading1: Joi.string(),
                tamil_heading1: Joi.string(),
                telegu_heading1: Joi.string(),

                heading2: Joi.string(),
                hindi_heading2: Joi.string(),
                marathi_heading2: Joi.string(),
                tamil_heading2: Joi.string(),
                telegu_heading2: Joi.string(),

                heading3: Joi.string(),
                hindi_heading3: Joi.string(),
                marathi_heading3: Joi.string(),
                tamil_heading3: Joi.string(),
                telegu_heading3: Joi.string(),

                heading4: Joi.string(),
                hindi_heading4: Joi.string(),
                marathi_heading4: Joi.string(),
                tamil_heading4: Joi.string(),
                telegu_heading4: Joi.string(),

                heading5: Joi.string(),
                hindi_heading5: Joi.string(),
                marathi_heading5: Joi.string(),
                tamil_heading5: Joi.string(),
                telegu_heading5: Joi.string(),

                active           : Joi.boolean()
        })
        const { error } = schema.validate(page);
        if (error) return res.status(400).json({ error });
      
      
        page.createdBy = req.user.id;
        page.updatedBy = req.user.id;

        page           = await GrpModel.create(page);

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
 
        let response = await GrpModel.findAndCountAll({
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
                        heading1: Joi.string(),
                        hindi_heading1: Joi.string(),
                        marathi_heading1: Joi.string(),
                        tamil_heading1: Joi.string(),
                        telegu_heading1: Joi.string(),
                        heading2: Joi.string(),
                        hindi_heading2: Joi.string(),
                        marathi_heading2: Joi.string(),
                        tamil_heading2: Joi.string(),
                        telegu_heading2: Joi.string(),
                        heading3: Joi.string(),
                        hindi_heading3: Joi.string(),
                        marathi_heading3: Joi.string(),
                        tamil_heading3: Joi.string(),
                        telegu_heading3: Joi.string(),
                        heading4: Joi.string(),
                        hindi_heading4: Joi.string(),
                        marathi_heading4: Joi.string(),
                        tamil_heading4: Joi.string(),
                        telegu_heading4: Joi.string(),
                        heading5: Joi.string(),
                        hindi_heading5: Joi.string(),
                        marathi_heading5: Joi.string(),
                        tamil_heading5: Joi.string(),
                        telegu_heading5: Joi.string(),
                        active           : Joi.boolean()
    })
    const { error } = schema.validate(page);
    if (error) return res.status(400).json({ error });
  
   
    page.updatedBy = req.user.id;
    page           = await GrpModel.update(page,{where:{id: req.params.id}});

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

        await GrpModel.destroy({where:{id: req.params.id}});
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
        
     
        data.allpage = await GrpModel.findAndCountAll({
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