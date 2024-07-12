'use strict';

const express   = require('express');
const app       = express();
const cors      = require('cors');

require('module-alias/register');

app.use(cors());
require('@lib/env');
require('@lib/loggger');
require('@middleware/express-setup')(app);
require('@middleware/error-handler')(app);
require('@middleware/server')(app);
require('@middleware/router')(app);
require('../database/migrations/index');

require('./model');
// const sequelize                 = require('@lib/sequelize')
// const {EmiCalculatorHeadingModel }              = require('@database');

// EmiCalculatorHeadingModel.sync({ force: true })

module.exports = app;