'use strict';

const router                                = require('express').Router();
const { FaqController }                     = require('@api/controller');
const Auth                                  = require('@middleware/authorization');

router.post('/',                        Auth.isAuthenticated(),                 FaqController.create);
router.get('/',                         Auth.isAuthenticated(),                 FaqController.get);
router.put('/:id',                      Auth.isAuthenticated(),                 FaqController.update);
router.delete('/:id',                   Auth.isAuthenticated(),                 FaqController.remove);
router.post('/faqHeading',              Auth.isAuthenticated(),                 FaqController.createFaqHeading);
router.get('/faqHeading',               Auth.isAuthenticated(),                 FaqController.getFaqHeading);
router.put('/faqHeading/:id',           Auth.isAuthenticated(),                 FaqController.updateFaqHeading);
router.get('/pageData',                                                         FaqController.getData);

module.exports = router;