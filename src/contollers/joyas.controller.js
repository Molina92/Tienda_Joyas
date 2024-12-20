const Joyas = require('../models/Joyas');

const handleGetJoyas = async (req, res, next) => {
    try {
        const { limit, order_by, page } = req.query;

        const response = await Joyas.getJoyas({ limit, order_by, page });

        if (response.totalJoyas === 0) {
            const error = new Error('Jewel_Not_Found');
            return next(error);
        }

        res.status(200).json({
            msg: 'Joyas obtenidas con éxito',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetJoyasFiltered = async (req, res, next) => {
    try {
        const { limit, order_by, page, precio_min, precio_max, categoria, metal } = req.query;

        const response = await Joyas.getJoyasFiltered({ limit, order_by, page, precio_min, precio_max, categoria, metal });
        
        if (response.rowCount === 0) {
            const error = new Error('Jewel_Not_Found');
            return next(error);
        }

        res.status(200).json({
            msg: 'Joyas obtenidas con éxito',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    handleGetJoyas,
    handleGetJoyasFiltered,
};