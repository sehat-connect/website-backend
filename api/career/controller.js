'use strict';

const modelName                 = 'Career';
const Joi                       = require('joi');
const { CareerModel,
    CareerBenefitsModel,
    HomePartnerModel,
    CareerHeadingModel,
    ApplyModel,
    CareerFactsModel }           = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');
const slug                      = require('slug');


const createCareer = async(req,res,next) =>{
    let career = req.body
    career.active = true
    try {
        const schema = Joi.object({
            title            : Joi.string().trim(),
            hindi_title      : Joi.string().required().trim(),
            marathi_title    : Joi.string().required().trim(),
            tamil_title      : Joi.string().required().trim(),
            telegu_title     : Joi.string().required().trim(),
            description      :Joi.string().required(),
            hindi_description :Joi.string().required(),
            marathi_description :Joi.string().required(),
            tamil_description :Joi.string().required(),
            telegu_description :Joi.string().required(),
            location      :Joi.string().required(),
            hindi_location :Joi.string().required(),
            marathi_location :Joi.string().required(),
            tamil_location :Joi.string().required(),
            telegu_location :Joi.string().required(),
            sortOrder        : Joi.number().required(),
            active:Joi.boolean()
        })
        const {error} = schema.validate(career);
        if (error) return res.status(400).json({ error });
        
        career.createdBy = req.user.id;
        career.updatedBy = req.user.id;
        career           = await CareerModel.create(career);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: career
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
        
    }
}
const getCareer = async(req,res,next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await CareerModel.findAndCountAll({
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

const updateCareer = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "career id is required"});
        let career = req.body || {}
        const schema = Joi.object({
                title            : Joi.string().trim(),
                hindi_title      : Joi.string().required().trim(),
                marathi_title    : Joi.string().required().trim(),
                tamil_title      : Joi.string().required().trim(),
                telegu_title     : Joi.string().required().trim(),
                description      :Joi.string().required(),
                hindi_description :Joi.string().required(),
                marathi_description :Joi.string().required(),
                tamil_description :Joi.string().required(),
                telegu_description :Joi.string().required(),
                location      :Joi.string().required(),
                hindi_location :Joi.string().required(),
                marathi_location :Joi.string().required(),
                tamil_location :Joi.string().required(),
                telegu_location :Joi.string().required(),
                sortOrder        : Joi.number().required(),
                active:Joi.boolean().required()
        })
    const { error } = schema.validate(career);
    if (error) return res.status(400).json({ error });
  
    career.updatedBy = req.user.id;
    career           = await CareerModel.update(career,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "career updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const removeCareer = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CareerModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "career deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const createBenefit = async (req,res, next) => {
    let CareerBenefits = await FILE_UPLOAD.uploadMultipleFile(req);
    CareerBenefits.active = true;
    try {
        const schema = Joi.object({
                title            : Joi.string().trim(),
                hindi_title      : Joi.string().required().trim(),
                marathi_title    : Joi.string().required().trim(),
                tamil_title      : Joi.string().required().trim(),
                telegu_title     : Joi.string().required().trim(),
                sortOrder        : Joi.number().required(),
                files            : Joi.array(),
                active           : Joi.boolean()
        })
        const { error } = schema.validate(CareerBenefits);
        if (error) return res.status(400).json({ error });
      
        let files = CareerBenefits.files;
        if (files.length) {
            CareerBenefits.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
        } else delete CareerBenefits.files;

        CareerBenefits.createdBy = req.user.id;
        CareerBenefits.updatedBy = req.user.id;

        CareerBenefits           = await CareerBenefitsModel.create(CareerBenefits);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: CareerBenefits
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getBenefit = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await CareerBenefitsModel.findAndCountAll({
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

const updateBenefit = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "Value id is required"});
        let CareerBenefits = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title            : Joi.string().trim(),
            hindi_title      : Joi.string().required().trim(),
            marathi_title    : Joi.string().required().trim(),
            tamil_title      : Joi.string().required().trim(),
            telegu_title     : Joi.string().required().trim(),
            sortOrder        : Joi.number().required(),
            files            : Joi.array(),
            active           : Joi.boolean()
    })
    const { error } = schema.validate(CareerBenefits);
    if (error) return res.status(400).json({ error });
  
    let files = CareerBenefits.files;
    if (files.length) {
        CareerBenefits.file = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
    } else delete CareerBenefits.files;

    CareerBenefits.updatedBy = req.user.id;
 
    CareerBenefits           = await CareerBenefitsModel.update(CareerBenefits,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "Values updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const removeBenefit = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CareerBenefitsModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Values deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const createHeading = async (req,res,next) => {

    let careerHeading = await FILE_UPLOAD.uploadMultipleFile(req);
    careerHeading.active  = true;
    try {
        const schema = Joi.object({
            heading1            : Joi.string().trim(),
            hindi_heading1      : Joi.string().trim(),
            marathi_heading1    : Joi.string().trim(),
            tamil_heading1      : Joi.string().trim(),
            telegu_heading1     : Joi.string().trim(),
            description1            : Joi.string().trim(),
            hindi_description1      : Joi.string().trim(),
            marathi_description1    : Joi.string().trim(),
            tamil_description1      : Joi.string().trim(),
            telegu_description1     : Joi.string().trim(),
            youtube_link        : Joi.string().trim(),
            heading2            : Joi.string().trim(),
            hindi_heading2      : Joi.string().trim(),
            marathi_heading2    : Joi.string().trim(),
            tamil_heading2      : Joi.string().trim(),
            telegu_heading2     : Joi.string().trim(),
            heading3            : Joi.string().trim(),
            hindi_heading3      : Joi.string().trim(),
            marathi_heading3    : Joi.string().trim(),
            tamil_heading3      : Joi.string().trim(),
            telegu_heading3     : Joi.string().trim(),
            description3            : Joi.string().trim(),
            hindi_description3      : Joi.string().trim(),
            marathi_description3    : Joi.string().trim(),
            tamil_description3      : Joi.string().trim(),
            telegu_description3     : Joi.string().trim(),
            heading4            : Joi.string().trim(),
            hindi_heading4      : Joi.string().trim(),
            marathi_heading4    : Joi.string().trim(),
            tamil_heading4      : Joi.string().trim(),
            telegu_heading4     : Joi.string().trim(),
            description4            : Joi.string().trim(),
            hindi_description4      : Joi.string().trim(),
            marathi_description4    : Joi.string().trim(),
            tamil_description4      : Joi.string().trim(),
            telegu_description4     : Joi.string().trim(),
            email               : Joi.string().trim(),
            heading5            : Joi.string().trim(),
            hindi_heading5      : Joi.string().trim(),
            marathi_heading5    : Joi.string().trim(),
            tamil_heading5      : Joi.string().trim(),
            telegu_heading5     : Joi.string().trim(),

            heading6            : Joi.string().trim(),
            hindi_heading6      : Joi.string().trim(),
            marathi_heading6    : Joi.string().trim(),
            tamil_heading6      : Joi.string().trim(),
            telegu_heading6     : Joi.string().trim(),
            name                : Joi.string().trim(),
            hindi_name          : Joi.string().trim(),
            marathi_name        : Joi.string().trim(),
            tamil_name          : Joi.string().trim(),
            telegu_name         : Joi.string().trim(),
            position            : Joi.string().trim(),
            hindi_position      : Joi.string().trim(),
            marathi_position    : Joi.string().trim(),
            tamil_position      : Joi.string().trim(),
            telegu_position     : Joi.string().trim(),

            hr_heading          : Joi.string().trim(),
            hindi_hr_heading    : Joi.string().trim(),
            marathi_hr_heading  : Joi.string().trim(),
            tamil_hr_heading    : Joi.string().trim(),
            telegu_hr_heading   : Joi.string().trim(),

            hr_description      : Joi.string().trim(),
            hindi_hr_description: Joi.string().trim(),
            marathi_hr_description: Joi.string().trim(),
            tamil_hr_description: Joi.string().trim(),
            telegu_hr_description: Joi.string().trim(),

            active              : Joi.boolean(),
            files: Joi.array(),

        })
        const {error} = schema.validate(careerHeading);
        if (error) return res.status(400).json({ error });
              
        let files = careerHeading.files;
      
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    careerHeading.file5 = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    careerHeading.file6 = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
                }
                
           });
        } else delete careerHeading.files;


        careerHeading.createdBy = req.user.id;
        careerHeading.updatedBy = req.user.id;
        //  console.log(careerHeading)
        careerHeading = await CareerHeadingModel.create(careerHeading);
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: careerHeading
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }

}
const getHeading = async(req,res,next) => {
    try {
        let query = req.query;
        let response = await CareerHeadingModel.findAndCountAll({
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
        let careerHeading = await FILE_UPLOAD.uploadMultipleFile(req);

        const schema = Joi.object({
            heading1            : Joi.string().trim(),
            hindi_heading1      : Joi.string().trim(),
            marathi_heading1    : Joi.string().trim(),
            tamil_heading1      : Joi.string().trim(),
            telegu_heading1     : Joi.string().trim(),
            description1            : Joi.string().trim(),
            hindi_description1      : Joi.string().trim(),
            marathi_description1    : Joi.string().trim(),
            tamil_description1      : Joi.string().trim(),
            telegu_description1     : Joi.string().trim(),
            youtube_link        : Joi.string().trim(),
            heading2            : Joi.string().trim(),
            hindi_heading2      : Joi.string().trim(),
            marathi_heading2    : Joi.string().trim(),
            tamil_heading2      : Joi.string().trim(),
            telegu_heading2     : Joi.string().trim(),
            heading3            : Joi.string().trim(),
            hindi_heading3      : Joi.string().trim(),
            marathi_heading3    : Joi.string().trim(),
            tamil_heading3      : Joi.string().trim(),
            telegu_heading3     : Joi.string().trim(),
            description3            : Joi.string().trim(),
            hindi_description3      : Joi.string().trim(),
            marathi_description3    : Joi.string().trim(),
            tamil_description3      : Joi.string().trim(),
            telegu_description3     : Joi.string().trim(),
            heading4            : Joi.string().trim(),
            hindi_heading4      : Joi.string().trim(),
            marathi_heading4    : Joi.string().trim(),
            tamil_heading4      : Joi.string().trim(),
            telegu_heading4     : Joi.string().trim(),
            description4            : Joi.string().trim(),
            hindi_description4      : Joi.string().trim(),
            marathi_description4    : Joi.string().trim(),
            tamil_description4      : Joi.string().trim(),
            telegu_description4     : Joi.string().trim(),
            email               : Joi.string().trim(),
            heading5            : Joi.string().trim(),
            hindi_heading5      : Joi.string().trim(),
            marathi_heading5    : Joi.string().trim(),
            tamil_heading5      : Joi.string().trim(),
            telegu_heading5     : Joi.string().trim(),

            heading6            : Joi.string().trim(),
            hindi_heading6      : Joi.string().trim(),
            marathi_heading6    : Joi.string().trim(),
            tamil_heading6      : Joi.string().trim(),
            telegu_heading6     : Joi.string().trim(),
            name                : Joi.string().trim(),
            hindi_name          : Joi.string().trim(),
            marathi_name        : Joi.string().trim(),
            tamil_name          : Joi.string().trim(),
            telegu_name         : Joi.string().trim(),
            position            : Joi.string().trim(),
            hindi_position      : Joi.string().trim(),
            marathi_position    : Joi.string().trim(),
            tamil_position      : Joi.string().trim(),
            telegu_position     : Joi.string().trim(),

            hr_heading          : Joi.string().trim(),
            hindi_hr_heading    : Joi.string().trim(),
            marathi_hr_heading  : Joi.string().trim(),
            tamil_hr_heading    : Joi.string().trim(),
            telegu_hr_heading   : Joi.string().trim(),

            hr_description      : Joi.string().trim(),
            hindi_hr_description: Joi.string().trim(),
            marathi_hr_description: Joi.string().trim(),
            tamil_hr_description: Joi.string().trim(),
            telegu_hr_description: Joi.string().trim(),
            active              : Joi.boolean(),
            files: Joi.array(),

        })
        const {error} = schema.validate(careerHeading);
        if (error) return res.status(400).json({ error });
        let files = careerHeading.files;
          
        if (files.length) {
            files.forEach((iteam)=>{
                if(iteam.fieldName== 'image1'){
                    careerHeading.file5 = files.filter(e => e.fieldName == 'image1').map(file => file.path).toString();
                }
                if(iteam.fieldName== 'image2'){
                    careerHeading.file6 = files.filter(e => e.fieldName == 'image2').map(file => file.path).toString();
                }
           });
        } else delete careerHeading.files;

        careerHeading.updatedBy = req.user.id;
        careerHeading = await CareerHeadingModel.update(careerHeading, { where: { id: req.params.id } });
    
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: careerHeading
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));    
    }
}

const createFacts = async (req,res, next) => {
    let careerFacts = req.body;
    careerFacts.active = true;
    try {
        const schema = Joi.object({
                title            : Joi.string().trim(),
                hindi_title      : Joi.string().required().trim(),
                marathi_title    : Joi.string().required().trim(),
                tamil_title      : Joi.string().required().trim(),
                telegu_title     : Joi.string().required().trim(),
                value            : Joi.string().trim(),
                short_description            : Joi.string().trim(),
                hindi_short_description      : Joi.string().required().trim(),
                marathi_short_description    : Joi.string().required().trim(),
                tamil_short_description      : Joi.string().required().trim(),
                telegu_short_description     : Joi.string().required().trim(),
                sortOrder        : Joi.number().required(),
                active           : Joi.boolean()
        })
        const { error } = schema.validate(careerFacts);
        if (error) return res.status(400).json({ error });
      

        careerFacts.createdBy = req.user.id;
        careerFacts.updatedBy = req.user.id;

        careerFacts           = await CareerFactsModel.create(careerFacts);

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: careerFacts
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const getFacts = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await CareerFactsModel.findAndCountAll({
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

const updateFacts = async(req,res, next) =>{
    try {
        if (!req.params.id) return res.status(400).json({error: "Value id is required"});
        let careerFacts = req.body;
        const schema = Joi.object({
                title            : Joi.string().trim(),
                hindi_title      : Joi.string().required().trim(),
                marathi_title    : Joi.string().required().trim(),
                tamil_title      : Joi.string().required().trim(),
                telegu_title     : Joi.string().required().trim(),
                value            : Joi.string().trim(),
                short_description            : Joi.string().trim(),
                hindi_short_description      : Joi.string().required().trim(),
                marathi_short_description    : Joi.string().required().trim(),
                tamil_short_description      : Joi.string().required().trim(),
                telegu_short_description     : Joi.string().required().trim(),
                sortOrder        : Joi.number().required(),
                active           : Joi.boolean()
    })
    const { error } = schema.validate(careerFacts);
    if (error) return res.status(400).json({ error });
  

    careerFacts.updatedBy = req.user.id;
 
    careerFacts           = await CareerFactsModel.update(careerFacts,{where:{id: req.params.id}});

    return res.status(200).send({
        status: CONSTANT.REQUESTED_CODES.SUCCESS,
        result: "Facts updated successfully"
    });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}


const removeFacts = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await CareerFactsModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Facts deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const getData = async(req,res,next) => {
    try {
        let query = req.query;
        let data = {}; 
         data.heading = await CareerHeadingModel.findOne({
            attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt','id'] },
            where: {active:true},
        })

        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
       

        delete query.offset;
        delete query.limit;
         query.active = true;
         data.allcareer = await CareerModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true},
            order:[['sortOrder','ASC']],
            offset: offset,
            limit: limit,
        })
        data.allBenefits = await CareerBenefitsModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true},
            order:[['sortOrder','ASC']],
            offset: offset,
            limit: limit,
        })
        data.allFacts = await CareerFactsModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt','id']},
            where: {active:true},
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
///////////////////////////


const applyJob = async (req,res, next) => {
    let apply = await FILE_UPLOAD.uploadMultipleFile(req);
    apply.active = true;
    try {
        const schema = Joi.object({

            name      : Joi.string().required().trim(),
            email    : Joi.string().required().trim(),
            phone      : Joi.string().required().trim(),
            department     : Joi.string(),
            pref_location     : Joi.string(),
            expected_ctc     : Joi.string(),
            current_ctc     : Joi.string(),
            company_name     : Joi.string(),
            designation     : Joi.string(),
            experience     : Joi.string(),
            notice_period     : Joi.string(),      
            files            : Joi.array(),
            active           : Joi.boolean()
        })
        const { error } = schema.validate(apply);
        if (error) return res.status(400).json({ error });
      
        let files = apply.files;
        if (files.length) {
            apply.resume = files.filter(e => e.fieldName == 'file').map(file => file.path).toString();
        } else delete apply.files;

        apply           = await ApplyModel.create(apply);
        
        if(apply.name){

            let enq = await ApplyModel.findOne({
                attributes: { exclude: ['createdBy', 'updatedBy', 'createdAt', 'updatedAt','id'] },
                where: {id:apply.id},
            })
         
       
            let compiled = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../../docs/email_templates/careerenquiry.ejs'), 'utf8')),
           
                                
                dataToCompile = {
                    name:enq.name,
                    email:enq.email,
                    phone:enq.phone,
                    department:enq.department,
                    pref_location:enq.pref_location,
                    expected_ctc:enq.expected_ctc,
                    current_ctc:enq.current_ctc,
                    company_name:enq.company_name,
                    designation:enq.designation,
                    experience:enq.experience,
                    notice_period:enq.notice_period,
                    resume:enq.resume,                                                  
                };                                                        
    
        await mail.sendMail([process.env.CAREER_MAIL], `India Shelter: Notification `, compiled(dataToCompile));
        }




        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result:'Job Applyied Successfully !'
        });
        
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const deleteApply = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await ApplyModel.destroy({where:{id: req.params.id}});
        return res.status(200).send({ 
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};


const applylist = async(req,res, next) =>{
    try {
        const limit     = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const offset    = parseInt(req.query && req.query.offset ? req.query.offset : 0);
        let query       = req.query;

        delete query.offset;
        delete query.limit;
 
        let response = await ApplyModel.findAndCountAll({
            attributes: {exclude: ['createdBy','updatedBy','createdAt','updatedAt']},
            where :query,
            order:[['createdAt','DESC']],
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



module.exports = {
    createCareer,
    getCareer,
    updateCareer,
    removeCareer,
    createBenefit,
    getBenefit,
    updateBenefit,
    removeBenefit,
    createHeading,
    getHeading,
    updateHeading,
    createFacts,
    getFacts,
    updateFacts,
    removeFacts,
    getData,
    applyJob,
    deleteApply,
    applylist
};