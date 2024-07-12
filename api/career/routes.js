'use strict';

const router                                = require('express').Router();
const { CareerController }                   = require('@api/controller');
const Auth                                  = require('@middleware/authorization');


router.post('/career',               Auth.isAuthenticated(),                 CareerController.createCareer);
router.get('/career',                Auth.isAuthenticated(),                 CareerController.getCareer);
router.put('/career/:id',            Auth.isAuthenticated(),                 CareerController.updateCareer);
router.delete('/career/:id',         Auth.isAuthenticated(),                 CareerController.removeCareer);

router.post('/benefit',               Auth.isAuthenticated(),                 CareerController.createBenefit);
router.get('/benefit',                Auth.isAuthenticated(),                 CareerController.getBenefit);
router.put('/benefit/:id',            Auth.isAuthenticated(),                 CareerController.updateBenefit);
router.delete('/benefit/:id',         Auth.isAuthenticated(),                 CareerController.removeBenefit);

router.post('/facts',               Auth.isAuthenticated(),                 CareerController.createFacts);
router.get('/facts',                Auth.isAuthenticated(),                 CareerController.getFacts);
router.put('/facts/:id',            Auth.isAuthenticated(),                 CareerController.updateFacts);
router.delete('/facts/:id',         Auth.isAuthenticated(),                 CareerController.removeFacts);

router.post('/heading',                Auth.isAuthenticated(),                 CareerController.createHeading);
router.get('/heading',                 Auth.isAuthenticated(),                 CareerController.getHeading);
router.put('/heading/:id',             Auth.isAuthenticated(),                 CareerController.updateHeading);



router.post('/apply',                                                   CareerController.applyJob);
router.delete('/apply/:id',             Auth.isAuthenticated(),           CareerController.deleteApply);
router.get('/apply',             Auth.isAuthenticated(),           CareerController.applylist);


router.get('/pageData',                                                        CareerController.getData);

module.exports = router;