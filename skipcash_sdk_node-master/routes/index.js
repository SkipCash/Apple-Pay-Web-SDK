var express = require("express");
var main = require("../functions/appleValidation.js");
var createPayment = require("../functions/createPayment.js");
const indexRouter = express.Router();

/**
 * This routes is for validation module
 */
indexRouter.get("/validateSession", main);

indexRouter.post("/makePayment", createPayment);

module.exports = indexRouter;
