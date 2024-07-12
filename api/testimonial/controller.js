'use strict';

const modelName                 = 'Testimonial';
const Joi                       = require('joi');
const { TestimonialModel }      = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');


const create = async (req,res, next) => {
    let testimonial = await FILE_UPLOAD.uploadMultipleFile(req);
        testimonial.active = true;
    try {
        const schema = Joi.object({
                name :Joi.string().required().trim(),
                hindi_name: Joi.string().required().trim(),
                marathi_name: Joi.string().required().trim(),
                tamil_name: Joi.string().required().trim(),
                telegu_name: Joi.string().required().trim(),
                location :Joi.string(),
                hindi_location: Joi.string().trim(),
                marathi_location: Joi.string().trim(),
                tamil_location: Joi.string().trim(),
                telegu_location: Joi.string().trim(),
                description :Joi.string().trim(),
                hindi_description: Joi.string().trim(),
                marathi_description: Joi.string().trim(),
                tamil_description: Joi.string().trim(),
                telegu_description: Joi.string().trim(),
                sortOrder :Joi.number(),
                files: Joi.array(),
                active :Joi.boolean()
        })
        const { error } = schema.validate(testimonial);
        if (error) return res.status(400).json({ error });
      
        let files = testimonial.files;
        if (files.length) {
            testimonial.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
        } else delete testimonial.files;

        testimonial.createdBy = req.user.id;
        testimonial.updatedBy = req.user.id;

        testimonial           = await TestimonialModel.create(testimonial);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: testimonial
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
 
        let response = await TestimonialModel.findAndCountAll({
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
        if (!req.params.id) return res.status(400).json({error: "Testimonial id is required"});
        let testimonial = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name :Joi.string().required().trim(),
                hindi_name: Joi.string().required().trim(),
                marathi_name: Joi.string().required().trim(),
                tamil_name: Joi.string().required().trim(),
                telegu_name: Joi.string().required().trim(),
                location :Joi.string(),
                hindi_location: Joi.string().trim(),
                marathi_location: Joi.string().trim(),
                tamil_location: Joi.string().trim(),
                telegu_location: Joi.string().trim(),
                description :Joi.string().trim(),
                hindi_description: Joi.string().trim(),
                marathi_description: Joi.string().trim(),
                tamil_description: Joi.string().trim(),
                telegu_description: Joi.string().trim(),
                sortOrder :Joi.number(),
                files: Joi.array(),
                active :Joi.boolean()
    })
    const { error } = schema.validate(testimonial);
    if (error) return res.status(400).json({ error });
  
    let files = testimonial.files;
    if (files.length) {
        testimonial.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
    } else delete testimonial.files;

    testimonial.updatedBy = req.user.id;
 
    testimonial           = await TestimonialModel.update(testimonial,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "Testimonial updated successfully"
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

        await TestimonialModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Testimonial deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    update,
    remove
};