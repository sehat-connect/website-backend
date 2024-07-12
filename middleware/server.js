"use strict";
const sequelize                  = require('@lib/sequelize');
const http  = require("http");
module.exports = (app) => {
    async function listen() {
        app.set("port", process.env.PORT);
        http.createServer(app).listen(process.env.PORT);
        console.log("App server started on port : " + process.env.PORT);
    }
    
    function dbError(err) {
        logger.error("Mongo connection error : ", err);
    }
    listen();
}