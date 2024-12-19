const { Router } = require('express')
const router = Router()

const { handleGetJoyas, handleGetJoyasFiltered } = require('../contollers/joyas.controller');

router.get("/", handleGetJoyas)
router.get("/filtros", handleGetJoyasFiltered)

// router.post("/", handleCreateViaje)
// router.put("/:id", handleModificarViaje)
// router.delete("/:id", handleEliminarViaje)

module.exports = router;