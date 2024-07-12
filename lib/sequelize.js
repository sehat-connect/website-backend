'use strict';
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVE,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
      }
  });
  sequelize.authenticate()
  .then(() => {
     console.log('Connection has been established successfully.'); // eslint-disable-line no-console
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err); // eslint-disable-line no-console
  });

module.exports = sequelize;