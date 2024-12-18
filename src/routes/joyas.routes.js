const { Router } = require('express')
const router = Router()

const { handleGetJoyas } = require('../contollers/joyas.controller');

router.get("/", handleGetJoyas)

// router.post("/", handleCreateViaje)
// router.put("/:id", handleModificarViaje)
// router.delete("/:id", handleEliminarViaje)

module.exports = router;