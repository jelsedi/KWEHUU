const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {

    logger.error(err);

    res.status(err.statusCode || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

};