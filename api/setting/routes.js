'use strict';

const router                                = require('express').Router();
const { SettingController }                  = require('@api/controller');
const Auth                                  = require('@middleware/authorization');

router.post('/state',                  Auth.isAuthenticated(),                 SettingController.createState);
router.get('/state',                   Auth.isAuthenticated(),                 SettingController.getState);
router.put('/state/:id',               Auth.isAuthenticated(),                 SettingController.updateState);
router.post('/city',                   Auth.isAuthenticated(),                 SettingController.createCity);
router.get('/city',                    Auth.isAuthenticated(),                 SettingController.getCity);
router.put('/city/:id',                Auth.isAuthenticated(),                 SettingController.updateCity);
router.post('/locality',                   Auth.isAuthenticated(),                 SettingController.createLocality);
router.get('/locality',                    Auth.isAuthenticated(),                 SettingController.getLocality);
router.put('/locality/:id',                Auth.isAuthenticated(),                 SettingController.updateLocality);

router.get('/pageData',                                                        SettingController.getData);

module.exports = router;