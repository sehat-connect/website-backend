'use strict';

const router                                = require('express').Router();
const { AboutController }                   = require('@api/controller');
const Auth                                  = require('@middleware/authorization');


router.post('/heading',                Auth.isAuthenticated(),                 AboutController.createHeading);
router.get('/heading',                 Auth.isAuthenticated(),                 AboutController.getHeading);
router.put('/heading/:id',             Auth.isAuthenticated(),                 AboutController.updateHeading);
router.delete('/heading/:id',             Auth.isAuthenticated(),                 AboutController.remove);




router.get('/pageData',                                                        AboutController.getData);

module.exports = router;