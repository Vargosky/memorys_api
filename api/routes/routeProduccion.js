const express = require("express");
const router = express.Router();
const ProduccionController =  require("../controllers/ctrlProduccion");

const {
  crearProduccion,
  obtenerProducciones,
  obtenerProduccionPorId,
  actualizarProduccion,
  eliminarProduccion,
  obtenerProduccionesPaginadas

} = ProduccionController;

router.get('/all/', obtenerProducciones);
router.get('/:limite/:pagina', obtenerProduccionesPaginadas);
router.get('/test',()=>{ return ({test:"test"})})
router.get('/all/', obtenerProducciones);
router.get('/:id', obtenerProduccionPorId);
router.post('/create/', crearProduccion);
router.put('/:id', actualizarProduccion);
router.delete('/:id', eliminarProduccion);
router.get('/:limite/:pagina/', obtenerProduccionesPaginadas);


module.exports = router;
