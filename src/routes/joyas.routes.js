const { Router } = require('express')
const router = Router()

const { handleGetJoyas, handleGetJoyasFiltered } = require('../contollers/joyas.controller');

router.get("/", handleGetJoyas)
router.get("/filtros", handleGetJoyasFiltered)

module.exports = router;