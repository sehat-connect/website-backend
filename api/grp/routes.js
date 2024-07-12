'use strict';

const router                                = require('express').Router();
const { GrpController }                   = require('@api/controller');
const Auth                                  = require('@middleware/authorization');

router.post('/',               Auth.isAuthenticated(),                 GrpController.create);
router.get('/',                Auth.isAuthenticated(),                 GrpController.get);
router.put('/:id',            Auth.isAuthenticated(),                 GrpController.update);



router.get('/pageData',                                                        GrpController.getData);

module.exports = router;