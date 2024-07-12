'use strict';

const router                                = require('express').Router();
const { ContactController }                     = require('@api/controller');
const Auth                                  = require('@middleware/authorization');


router.get('/pageData',                                                         ContactController.getData);

router.post('/enquiry',                                                               ContactController.createEnquiry);
router.get('/enquiry',                         Auth.isAuthenticated(),                 ContactController.getEnquiry);
router.delete('/enquiry/:id',                   Auth.isAuthenticated(),                 ContactController.removeEnquiry);

module.exports = router;