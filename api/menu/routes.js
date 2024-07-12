'use strict';

const router                                = require('express').Router();
const { MenuController }             = require('@api/controller');
const Auth                                  = require('@middleware/authorization');

router.post('/',                        Auth.isAuthenticated(),                 MenuController.create);
router.get('/',                         Auth.isAuthenticated(),                 MenuController.get);
router.put('/:id',                      Auth.isAuthenticated(),                 MenuController.update);
router.delete('/:id',                   Auth.isAuthenticated(),                 MenuController.remove);
module.exports = router;