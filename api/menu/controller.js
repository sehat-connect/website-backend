'use strict';

const modelName                 = 'Menu';
const Joi                       = require('joi');
const { MenuModel }             = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');


const create = async (req,res, next) => {
    let menu = await FILE_UPLOAD.uploadMultipleFile(req);
        menu.active = true;
    try {
        const schema = Joi.object({
                menuName :Joi.string().trim(),
                title :Joi.string().trim().empty(''),
                description : Joi.string().trim().empty(''),
                title1 :Joi.string().trim().empty(''),
                description1 : Joi.string().trim().empty(''),
                title2 :Joi.string().trim().empty(''),
                description2 : Joi.string().trim().empty(''),
                link :Joi.string().empty(''),
                sortOrder :Joi.number(),
                metaTag: Joi.string().empty('').empty(''),
                metaTitle: Joi.string().empty(''),
                metaDescription: Joi.string().empty('').empty(''),
                files: Joi.array(),
                active :Joi.boolean()
        })
        const { error } = schema.validate(menu);
        if (error) return res.status(400).json({ error });
      
        let files = menu.files;
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    menu.file = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    menu.image2 = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString(); 
                }
           });
        } else delete menu.files;

        menu.createdBy = req.user.id;
        menu.updatedBy = req.user.id;
        menu.link   = slug(req.body.menuName);

        menu           = await MenuModel.create(menu);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: menu
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
 
        let response = await MenuModel.findAndCountAll({
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
        if (!req.params.id) return res.status(400).json({error: "menu id is required"});
        let menu = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
             
            menuName :Joi.string().trim(),
            title :Joi.string().trim().empty(''),
            description : Joi.string().trim().empty(''),
            title1 :Joi.string().trim().empty(''),
            description1 : Joi.string().trim().empty(''),
            title2 :Joi.string().trim().empty(''),
            description2 : Joi.string().trim().empty(''),
            link :Joi.string().empty(''),
            sortOrder :Joi.number().empty(''),
            metaTag: Joi.string().empty('').empty(''),
            metaTitle: Joi.string().empty(''),
            metaDescription: Joi.string().empty('').empty(''),
            files: Joi.array(),
            active :Joi.boolean()
    })
    const { error } = schema.validate(menu);
    if (error) return res.status(400).json({ error });
  
    let files = menu.files;
    if (files.length) {
        files.forEach((iteam)=>{
            if(iteam.fieldName== 'image1'){
                menu.file = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
            }
            if(iteam.fieldName== 'image2'){
                menu.mobilefile = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString(); 
            }
       });
    } else delete menu.files;

    menu.updatedBy = req.user.id;
 
    menu           = await MenuModel.update(menu,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "menu updated successfully"
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

        await MenuModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "menu deleted successfully" 
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