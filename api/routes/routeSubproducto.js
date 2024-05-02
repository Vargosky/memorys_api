const express = require("express");
const router = express.Router();

const {
    getAllSubproductos,
    getSubproductoById,
    createSubproducto,
    updateSubproductoById,
    deleteSubproductoById,
    getValorizadoReceta,
    getRecetasValorizadasPaginadas,
} = require('../controllers/ctrlSubProducto.js');

router.get('/all/', getAllSubproductos);
router.get('/:id', getSubproductoById);
router.post('/create/', createSubproducto);
router.put('/:id', updateSubproductoById);
router.delete('/:id', deleteSubproductoById);
router.get('/value/:id', getValorizadoReceta);
router.get('/all/values/:page',getRecetasValorizadasPaginadas)

module.exports = router;
