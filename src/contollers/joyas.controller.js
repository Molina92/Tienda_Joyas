const Joyas = require('../models/Joyas')

const handleGetJoyas = async (req, res, next) => {
    try {
        const { limit, order_by, page } = req.query
        const response = await Joyas.getJoyas({ limit, order_by, page })

        res.status(200).json({
            msg: 'Joyas obtenidas con éxito',
            data: response
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleGetJoyas
}