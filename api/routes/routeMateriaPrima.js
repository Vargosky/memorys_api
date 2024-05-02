const express = require("express");
const router = express.Router();


const {
  getAllRawMaterials,
  getRawMaterialById,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  buscarPorNombre,
  getRawMaterialsPaginated,
  descontarCantidad
} = require('../controllers/ctrlMateriaPrima');

router.get('/all/', getAllRawMaterials);
router.get('/:id', getRawMaterialById);
router.post('/create/', createRawMaterial);
router.put('/:id', updateRawMaterial);
router.delete('/:id', deleteRawMaterial);
router.get('/buscar/:nombre', buscarPorNombre);
router.get('/list/:page',getRawMaterialsPaginated); 
router.put('/descontar/:id/:cantidad',descontarCantidad);   



module.exports = router;