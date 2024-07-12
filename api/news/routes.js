'use strict';

const router                         = require('express').Router();
const { NewsController }            = require('@api/controller');
const Auth                           = require('@middleware/authorization');

router.post('/',                    Auth.isAuthenticated(),                 NewsController.create);
router.get('/',                     Auth.isAuthenticated(),                 NewsController.get);
router.put('/:id',                  Auth.isAuthenticated(),                 NewsController.update);
router.delete('/:id',               Auth.isAuthenticated(),                 NewsController.remove);
router.get('/pageData',                                                     NewsController.getData);

module.exports = router;