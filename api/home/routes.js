'use strict';

const router                                = require('express').Router();
const { HomeController }                    = require('@api/controller');
const Auth                                  = require('@middleware/authorization');

router.post('/homeBanner',                        Auth.isAuthenticated(),                 HomeController.createHomeBanner);
router.get('/homeBanner',                         Auth.isAuthenticated(),                 HomeController.getHomeBanner);
router.put('/homeBanner/:id',                     Auth.isAuthenticated(),                 HomeController.updateHomeBanner);
router.delete('/homeBanner/:id',                  Auth.isAuthenticated(),                 HomeController.removeHomeBanner);

router.post('/heading',                           Auth.isAuthenticated(),                 HomeController.createHeading);
router.get('/heading',                            Auth.isAuthenticated(),                 HomeController.getHeading);
router.put('/heading/:id',                        Auth.isAuthenticated(),                 HomeController.updateHeading);


router.post('/faq',                        Auth.isAuthenticated(),                 HomeController.createFAQ);
router.get('/faq',                         Auth.isAuthenticated(),                 HomeController.getFAQ);
router.put('/faq/:id',                     Auth.isAuthenticated(),                 HomeController.updateFAQ);
router.delete('/faq/:id',                  Auth.isAuthenticated(),                 HomeController.removeFAQ);


router.post('/homePartner',                        Auth.isAuthenticated(),                 HomeController.createHomePartner);
router.get('/homePartner',                         Auth.isAuthenticated(),                 HomeController.getHomePartner);
router.put('/homePartner/:id',                     Auth.isAuthenticated(),                 HomeController.updateHomePartner);
router.delete('/homePartner/:id',                  Auth.isAuthenticated(),                 HomeController.removeHomePartner);


router.post('/feature',           Auth.isAuthenticated(),                 HomeController.createFeature);
router.get('/feature',            Auth.isAuthenticated(),                 HomeController.getFeature);
router.put('/feature/:id',        Auth.isAuthenticated(),                 HomeController.updateFeature);
router.delete('/feature/:id',     Auth.isAuthenticated(),                 HomeController.removeFeature);









router.get('/pageData',                                                            HomeController.getData);


module.exports = router;