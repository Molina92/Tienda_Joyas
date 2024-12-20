const errors = require('../helpers/errorsMessajes');

const errorMiddleware = (err, req, res, next) => {
    const errorDetails = errors[err.message] || errors['Server_Error'];

    const response = {
        id: errorDetails.id,
        message: errorDetails.message,
        description: errorDetails.description,
    };

    res.status(errorDetails.statusCode).json(response);
};

module.exports = errorMiddleware;