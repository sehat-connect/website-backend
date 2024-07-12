'use strict';

const modelName                 = 'Home';
const Joi                       = require('joi');
const { HomeBannerModel,
    HomeHeadingModel,
    HomeFaqModel,
    MenuModel,
    NewsModel,
    loanHeadingModel,
    HomePartnerModel,
    HomeFeatureModel }          = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');
const { Utils } = require('sequelize');


const createHomeBanner = async (req,res, next) => {
    let homeBanner = await FILE_UPLOAD.uploadMultipleFile(req);
        homeBanner.active = true;
    try {
        const schema = Joi.object({
                title :Joi.string().trim(),
                description :Joi.string().trim(),
                sortOrder :Joi.number(),
                files: Joi.array(),
                active :Joi.boolean()
        })
        const { error } = schema.validate(homeBanner);
        if (error) return res.status(400).json({ error });
      
        let files = homeBanner.files;
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    homeBanner.file = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    homeBanner.mobilefile = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
                }

           });
        } else delete homeBanner.files;

        homeBanner.createdBy = req.user.id;
        homeBanner.updatedBy = req.user.id;

        homeBanner           = await HomeBannerModel.create(homeBanner);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homeBanner
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getHomeBanner = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await HomeBannerModel.findAndCountAll({
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

const updateHomeBanner = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "homeBanner id is required"});
        let homeBanner = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title :Joi.string().trim(),
            description :Joi.string().trim(),
            sortOrder :Joi.number(),
            files: Joi.array(),
            active :Joi.boolean()
    })
    const { error } = schema.validate(homeBanner);
    if (error) return res.status(400).json({ error });
  
    let files = homeBanner.files;
    if (files.length) {
        files.forEach((iteam)=>{
            if(iteam.fieldName== 'image1'){
                homeBanner.file = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
            }
            if(iteam.fieldName== 'image2'){
                homeBanner.mobilefile = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
            }

       });
    } else delete homeBanner.files;

    homeBanner.updatedBy = req.user.id;
 
    homeBanner           = await HomeBannerModel.update(homeBanner,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "Home Banner updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const removeHomeBanner = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeBannerModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Home Banner deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createHeading = async (req,res,next) => {

    let homeHeading = await FILE_UPLOAD.uploadMultipleFile(req);
    homeHeading.active  = true;
    try {
        const schema = Joi.object({
            title                : Joi.string().trim(),
            description          : Joi.string().trim().empty(''),
            whatTitle        : Joi.string().trim().empty(''),
            howTitle          : Joi.string().trim().empty(''),
            howDescription         : Joi.string().trim().empty(''),
            participateTitle                : Joi.string().trim().empty(''),
            participateDescription          : Joi.string().trim().empty(''),
            healthTitle        : Joi.string().trim().empty(''),
            healthDescription   : Joi.string().trim().empty(''),
      
            active                  : Joi.boolean(),
            files                   : Joi.array(),

        })
        const {error} = schema.validate(homeHeading);
        if (error) return res.status(400).json({ error });
              
        let files = homeHeading.files;

        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    homeHeading.video = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    homeHeading.participateImage = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
                }
               
           });
        } else delete homeHeading.files;


        homeHeading.createdBy = req.user.id;
        homeHeading.updatedBy = req.user.id;
    
        homeHeading = await HomeHeadingModel.create(homeHeading);
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homeHeading
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
const getHeading = async(req,res,next) => {
    try {
        let query = req.query;
        let response = await HomeHeadingModel.findAndCountAll({
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
        let homeHeading = await FILE_UPLOAD.uploadMultipleFile(req);

        const schema = Joi.object({
            
            title                : Joi.string().trim(),
            description          : Joi.string().trim().empty(''),
            whatTitle        : Joi.string().trim().empty(''),
            howTitle          : Joi.string().trim().empty(''),
            howDescription         : Joi.string().trim().empty(''),
            participateTitle                : Joi.string().trim().empty(''),
            participateDescription          : Joi.string().trim().empty(''),
            healthTitle        : Joi.string().trim().empty(''),
            healthDescription   : Joi.string().trim().empty(''),
      
            active                  : Joi.boolean(),
            files                   : Joi.array(),

        })
        const {error} = schema.validate(homeHeading);
        if (error) return res.status(400).json({ error });
        let files = homeHeading.files;
          
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    homeHeading.video = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    homeHeading.participateImage = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
                }
              
           });
        } else delete homeHeading.files;

        homeHeading.updatedBy = req.user.id;
        homeHeading = await HomeHeadingModel.update(homeHeading, { where: { id: req.params.id } });
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homeHeading
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }
}


const createFAQ = async (req,res, next) => {
    let faq = req.body || {}
        faq.active = true;
    try {
        const schema = Joi.object({
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

        faq     = await HomeFaqModel.create(faq);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: faq
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getFAQ = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await HomeFaqModel.findAndCountAll({
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

const updateFAQ = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "faq id is required"});
        let faq = req.body || {}
        const schema = Joi.object({
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
 
    faq           = await HomeFaqModel.update(faq,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "faq updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const removeFAQ = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeFaqModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "faq deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createHomePartner = async (req,res, next) => {
    let homeBanner = await FILE_UPLOAD.uploadMultipleFile(req);
        homeBanner.active = true;
    try {
        const schema = Joi.object({
                sortOrder :Joi.number(),
                files: Joi.array(),
                active :Joi.boolean()
        })
        const { error } = schema.validate(homeBanner);
        if (error) return res.status(400).json({ error });
      
        let files = homeBanner.files;
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    homeBanner.file = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }


           });
        } else delete homeBanner.files;

        homeBanner.createdBy = req.user.id;
        homeBanner.updatedBy = req.user.id;

        homeBanner           = await HomePartnerModel.create(homeBanner);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: homeBanner
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getHomePartner = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await HomePartnerModel.findAndCountAll({
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

const updateHomePartner = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "homeBanner id is required"});
        let homeBanner = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            sortOrder :Joi.number(),
            files: Joi.array(),
            active :Joi.boolean()
    })
    const { error } = schema.validate(homeBanner);
    if (error) return res.status(400).json({ error });
  
    let files = homeBanner.files;
    if (files.length) {
        files.forEach((iteam)=>{
            if(iteam.fieldName== 'image1'){
                homeBanner.file = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
            }
           

       });
    } else delete homeBanner.files;

    homeBanner.updatedBy = req.user.id;
 
    homeBanner           = await HomePartnerModel.update(homeBanner,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "Home Partner updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const removeHomePartner = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomePartnerModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Home Partner deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getData = async(req,res,next) => {
    try {
        let query = req.query;
        let data = {}; 
         data.banner = await HomeBannerModel.findOne({
            attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt','id'] },
            where: {active:true},
        })

        data.heading = await HomeHeadingModel.findOne({
            attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt','id'] },
            where: {active:true},
        })
        
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
         query.active = true;
        data.featureList = await HomeFeatureModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :query,
            order:[['sortOrder','DESC']],
            offset: offset,
            limit: limit,
        })
  
        data.meta = await MenuModel.findOne({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :{link:'home'},
        })
  
        
        // data.allTestimonial = await TestimonialModel.findAndCountAll({
        //     attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
        //     where: {active:true},
        //     order:[['sortOrder','ASC']],
        //     offset: offset,
        //     limit: limit,
        // })
        // data.allNews = await NewsModel.findAndCountAll({
        //     attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
        //     where:{active:true,showOnHome:true},
        //     order:[['sortOrder','ASC']],
        //     offset: offset,
        //     limit: limit,
        // })

           
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: data
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}


const createFeature = async(req,res,next)=>{
    let feature = await FILE_UPLOAD.uploadMultipleFile(req);
    feature.active = true;
    try{

        const schema = Joi.object({
            title:Joi.string().required(),
            description:Joi.string().empty(''),
            link:Joi.string().empty(''),
            files:Joi.array(),
            sortOrder:Joi.number().empty(''),
            active:Joi.boolean()
            
        })

        const {error} = schema.validate(feature);
        if(error) return res.status(400).json({error});

        let files = feature.files;
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'file'){
                    feature.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
                }
           });
        } else delete feature.files;

        feature.createdBy = req.user.id;
        feature.updatedBy = req.user.id;
        feature = await HomeFeatureModel.create(feature);

        return res.status(200).send({
                status:CONSTANT.REQUESTED_CODES.SUCCESS,
                result:feature
        })

    }catch (error){
        return res.status(400).json(UTILS.errorHandler(error));

    }
}

const updateFeature = async (req,res,next )=>{
    if(!req.params.id) return res.status(400).json({error:'featur id required'});

    let feature = await FILE_UPLOAD.uploadMultipleFile(req);

    try {

        const schema = await Joi.object({
            title:Joi.string().trim().required(),
            description:Joi.string().empty(''),
            link:Joi.string().empty(''),
            sortOrder:Joi.number().empty(''),
            active:Joi.boolean(),
            files:Joi.array()
        })

        const {error}  = await schema.validate(feature);
        if(error) return res.status(400).json({error});

     
        let files = feature.files;
          
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'file'){
                    feature.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
                }
                             
           });
        } else delete feature.files;

        feature.updatedBy = req.user.id;
        feature.active = req.body.active?req.body.active:false;

        feature = await HomeFeatureModel.update(feature,{where:{id:req.params.id}});
       
        return res.status(200).send({
            status:CONSTANT.REQUESTED_CODES.SUCCESS,
            result:'record update successfully'
        })

    }catch (error){

        return res.status(400).json(UTILS.errorHandler(error));
    }


}



const getFeature = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await HomeFeatureModel.findAndCountAll({
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

const removeFeature = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await HomeFeatureModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "feature deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


module.exports = {
    createHomeBanner,
    getHomeBanner,
    updateHomeBanner,
    removeHomeBanner,
    createHeading,
    getHeading,
    updateHeading,
    createFAQ,
    getFAQ,
    updateFAQ,
    removeFAQ,
    createHomePartner,
    getHomePartner,
    updateHomePartner,
    removeHomePartner,
    getData,
    createFeature,
    updateFeature,
    getFeature,
    removeFeature
};