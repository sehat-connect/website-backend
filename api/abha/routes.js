'use strict';

const router                                = require('express').Router();
const { AbhaController }                   = require('@api/controller');
const Auth                                  = require('@middleware/authorization');

router.post('/heading',                Auth.isAuthenticated(),                 AbhaController.createHeading);
router.get('/heading',                 Auth.isAuthenticated(),                 AbhaController.getHeading);
router.put('/heading/:id',             Auth.isAuthenticated(),                 AbhaController.updateHeading);
router.delete('/heading/:id',             Auth.isAuthenticated(),                 AbhaController.remove);

router.post('/jwt',                                                        AbhaController.jwtValue);


router.get('/pageData',                                                        AbhaController.getData);


module.exports = router;