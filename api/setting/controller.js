'use strict';

const modelName                 = 'Setting';
const Joi                       = require('joi');
const { StateModel,
    CityModel,
    localityModel,
    HomePartnerModel }        = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');


const createState = async (req,res, next) => {
    let state = req.body
    state.active = true;
    try {
        const schema = Joi.object({
                title            : Joi.string().required().trim(),
                hindi_title      : Joi.string().required().trim(),
                marathi_title    : Joi.string().required().trim(),
                tamil_title      : Joi.string().required().trim(),
                telegu_title     : Joi.string().required().trim(),
                active           : Joi.boolean()
        })
        const { error } = schema.validate(state);
        if (error) return res.status(400).json({ error });
      

        state.createdBy = req.user.id;
        state.updatedBy = req.user.id;

        state           = await StateModel.create(state);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: state
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getState = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await StateModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :query,
            order:[['title','ASC']],
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

const updateState = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "state id is required"});
        let state = req.body
        const schema = Joi.object({
                title            : Joi.string().required().trim(),
                hindi_title      : Joi.string().required().trim(),
                marathi_title    : Joi.string().required().trim(),
                tamil_title      : Joi.string().required().trim(),
                telegu_title     : Joi.string().required().trim(),
                active           : Joi.boolean()
    })
    const { error } = schema.validate(state);
    if (error) return res.status(400).json({ error });

    state.updatedBy = req.user.id;
 
    state           = await StateModel.update(state,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "state updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}




const createCity = async (req,res,next) => {
    let city     = req.body;
    city.active  = true;
    try {
        const schema = Joi.object({
            stateId          : Joi.number().required(),
            title            : Joi.string().required().trim(),
            hindi_title      : Joi.string().required().trim(),
            marathi_title    : Joi.string().required().trim(),
            tamil_title      : Joi.string().required().trim(),
            telegu_title     : Joi.string().required().trim(),
            active           : Joi.boolean()
        })
        const {error} = schema.validate(city);
        if (error) return res.status(400).json({ error });
        city.createdBy = req.user.id;
        city.updatedBy = req.user.id;
    
        city = await CityModel.create(city);
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: city
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
const getCity = async(req,res,next) => {
    try {
        let query = req.query;
        let response = await CityModel.findAndCountAll({
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
const updateCity = async(req,res,next) =>{
    try {
        if (!req.params.id) return res.status(400).json({ error: "City id is required" });
        let city = req.body;
        const schema = Joi.object({
            stateId          : Joi.number().required(),
            title            : Joi.string().required().trim(),
            hindi_title      : Joi.string().required().trim(),
            marathi_title    : Joi.string().required().trim(),
            tamil_title      : Joi.string().required().trim(),
            telegu_title     : Joi.string().required().trim(),
            active              : Joi.boolean()
        })
        const {error} = schema.validate(city);
        if (error) return res.status(400).json({ error });
        city.updatedBy = req.user.id;
        city = await CityModel.update(city, { where: { id: req.params.id } });
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "City update successfully"
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }
}


const createLocality = async (req,res,next) => {
    let locality     = req.body;
    locality.active  = true;
    try {
        const schema = Joi.object({
            stateId          : Joi.number().required(),
            cityId           : Joi.number().required(),
            title            : Joi.string().required().trim(),
            hindi_title      : Joi.string().required().trim(),
            marathi_title    : Joi.string().required().trim(),
            tamil_title      : Joi.string().required().trim(),
            telegu_title     : Joi.string().required().trim(),
            active           : Joi.boolean()
        })
        const {error} = schema.validate(locality);
        if (error) return res.status(400).json({ error });
        locality.createdBy = req.user.id;
        locality.updatedBy = req.user.id;
    
        locality = await localityModel.create(locality);
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: locality
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
const getLocality = async(req,res,next) => {
    try {
        let query = req.query;
        let response = await localityModel.findAndCountAll({
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
const updateLocality = async(req,res,next) =>{
    try {
        if (!req.params.id) return res.status(400).json({ error: "locality id is required" });
        let locality = req.body;
        const schema = Joi.object({
            stateId          : Joi.number().required(),
            cityId           : Joi.number().required(),
            title            : Joi.string().required().trim(),
            hindi_title      : Joi.string().required().trim(),
            marathi_title    : Joi.string().required().trim(),
            tamil_title      : Joi.string().required().trim(),
            telegu_title     : Joi.string().required().trim(),
            active              : Joi.boolean()
        })
        const {error} = schema.validate(locality);
        if (error) return res.status(400).json({ error });
        locality.updatedBy = req.user.id;
        locality = await localityModel.update(locality, { where: { id: req.params.id } });
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "locality update successfully"
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }
}

const getData = async(req,res,next) => {
    try {
        let query = req.query;
        let data = {}; 
      
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
         query.active = true;
         data.allState= await StateModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where:  {active:true},
            order:[['title','DESC']],
            offset: offset,
            limit: limit,
        })
        query.stateId = req.query.stateId;
        data.allCity= await CityModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where:  query,
            order:[['title','DESC']],
            offset: offset,
            limit: limit,
        })
        query.cityId = req.query.cityId
        data.allLocality= await localityModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where:  query,
            order:[['title','DESC']],
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
    createState,
    getState,
    updateState,
    createCity,
    getCity,
    updateCity,
    createLocality,
    getLocality,
    updateLocality,
    getData
};