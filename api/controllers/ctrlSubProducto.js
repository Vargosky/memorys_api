// controllers/subproductoController.js

const Subproducto = require('../model/Subproducto');
const MateriaPrima = require('../model/MateriaPrima');

const createSubproducto = async (req, res) => {
    try {
        const newSubproducto = new Subproducto(req.body);
        // console.log(req.body.ingredients);
        const savedSubproducto = await newSubproducto.save();
        res.status(201).json(savedSubproducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el subproducto.' });
    }
};


const getAllSubproductos = async (req, res) => {
    try {
        const subproductos = await Subproducto.find();
        res.status(200).json(subproductos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los subproductos.' });
    }
};



const getSubproductoById = async (req, res) => {
    try {
        const subproducto = await Subproducto.findById(req.params.id);
        if (!subproducto) {
            return res.status(404).json({ error: 'Subproducto no encontrado.' });
        }
        res.status(200).json(subproducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el subproducto.' });
    }
};

const updateSubproductoById = async (req, res) => {
    try {
        const subproducto = await Subproducto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subproducto) {
            return res.status(404).json({ error: 'Subproducto no encontrado.' });
        }
        res.status(200).json(subproducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el subproducto.' });
    }
};

const deleteSubproductoById = async (req, res) => {
    try {
        const subproducto = await Subproducto.findByIdAndDelete(req.params.id);
        if (!subproducto) {
            return res.status(404).json({ error: 'Subproducto no encontrado.' });
        }
        res.status(200).json({ message: 'Subproducto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el subproducto.' });
    }
};


const getValorizadoReceta = async (req, res) => {

    try {
        const recetaId = req.params.id;

        // Buscamos la receta por su ID
        const receta = await Subproducto.findById(recetaId);
        if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada.' });
        }

        // Obtenemos la lista de ingredientes de la receta
        const ingredientes = receta.ingredients;

        // Creamos un objeto para almacenar los valores valorizados y la suma de los pesos
        const valorizado = {
            ingredientes: {},
            total: {
                valor: 0,
                unidad: '' // La unidad del total debe ser igual a la unidad de medida de los ingredientes
            }
        };

        // Inicializamos el total en cero
        let totalValorizado = 0;
        let totalCantidad = 0;

        // Iteramos por cada ingrediente para obtener el costo valorizado y la suma de los pesos
        for (const ingrediente of ingredientes) {
            const materiaPrimaId = ingrediente.materiaPrimaId;
            const cantidad = ingrediente.quantity;

            // Buscamos la materia prima por su ID
            const materiaPrima = await MateriaPrima.findById(materiaPrimaId);

            if (!materiaPrima) {
                return res.status(404).json({ error: `Materia prima con ID ${materiaPrimaId} no encontrada.` });
            }

            // Calculamos el costo valorizado del ingrediente
            const costoValorizado = materiaPrima.costoPorUnidad * cantidad;

            // Almacenamos el valor valorizado en el objeto resultante
            valorizado.ingredientes[materiaPrima.nombre] = {
                valor: costoValorizado,
                unidad: materiaPrima.unidad
            };

            // Sumamos el valor valorizado al total
            totalValorizado += costoValorizado;

            // Sumamos la cantidad al total de cantidad (peso total de los materiales)
            totalCantidad += cantidad;
        }

        // Agregamos el total valorizado y el total de cantidad al objeto resultante
        valorizado.total.valor = totalValorizado;
        valorizado.total.unidad = ingredientes.length > 0 ? ingredientes[0].unidad : '';

        valorizado.totalCantidad = totalCantidad;

        res.status(200).json(valorizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el costo valorizado de la receta.' });
    }
};

const getRecetasValorizadasPaginadas = async (req, res) => {

    try {
        const page = parseInt(req.params.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;

        // Obtenemos todas las recetas

        const recetas = await Subproducto.find().sort({ name: 1 }).skip(skip).limit(pageSize);



        // Creamos un arreglo para almacenar las recetas valorizadas
        const recetasValorizadas = [];

        // Iteramos por cada receta y calculamos el costo valorizado
        for (const receta of recetas) {

            const valorizadoReceta = await getValorizadoRecetaById(receta._id);
            recetasValorizadas.push({
                _id: receta._id,
                name: receta.name,
                category: receta.category,
                valorizado: valorizadoReceta
            });
        }

        res.status(200).json(recetasValorizadas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el listado de recetas valorizadas paginadas.' });
    }
};

const getValorizadoRecetaById = async (recetaId) => {
    // console.log(recetaId.toString());
    try {

        // Buscamos la receta por su ID
        const receta = await Subproducto.findById(recetaId);
        if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada.' });
        }

        // Obtenemos la lista de ingredientes de la receta
        const ingredientes = receta.ingredients;
        //hasta aca vamos bien---
        // Creamos un objeto para almacenar los valores valorizados y la suma de los pesos
        const valorizado = {
            ingredientes: {},
            total: {
                valor: 0,
                unidad: '' // La unidad del total debe ser igual a la unidad de medida de los ingredientes
            }
        };

        // Inicializamos el total en cero
        let totalValorizado = 0;
        let totalCantidad = 0;

        // Iteramos por cada ingrediente para obtener el costo valorizado y la suma de los pesos
        for (const ingrediente of ingredientes) {
            const materiaPrimaId = ingrediente.materiaPrimaId;
            const cantidad = ingrediente.quantity;

            // Buscamos la materia prima por su ID
            const materiaPrima = await MateriaPrima.findById(materiaPrimaId);

            if (!materiaPrima) {
                return res.status(404).json({ error: `Materia prima con ID ${materiaPrimaId} no encontrada.` });
            }

            // Calculamos el costo valorizado del ingrediente
            const costoValorizado = materiaPrima.costoPorUnidad * cantidad;

            // Almacenamos el valor valorizado en el objeto resultante
            valorizado.ingredientes[materiaPrima.nombre] = {
                valor: costoValorizado,
                unidad: materiaPrima.unidad
            };

            // Sumamos el valor valorizado al total
            totalValorizado += costoValorizado;

            // Sumamos la cantidad al total de cantidad (peso total de los materiales)
            totalCantidad += cantidad;
        }

        // Agregamos el total valorizado y el total de cantidad al objeto resultante
        valorizado.total.valor = totalValorizado;
        valorizado.total.unidad = ingredientes.length > 0 ? ingredientes[0].unidad : '';

        valorizado.totalCantidad = totalCantidad;

        return (valorizado);
    } catch (error) {
        return ({ error: 'Error al obtener el costo valorizado de la receta.' });
    }
};

module.exports = {
    createSubproducto,
    getAllSubproductos,
    getSubproductoById,
    updateSubproductoById,
    deleteSubproductoById,
    getValorizadoReceta,
    getRecetasValorizadasPaginadas,
    getValorizadoRecetaById
};
