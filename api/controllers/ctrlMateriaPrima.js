const RawMaterial = require('../model/MateriaPrima');

const getAllRawMaterials = async (req, res) => {
    try {
        console.log("Iniciando consulta a MongoDB Atlas...");
        const rawMaterials = await RawMaterial.find().sort({ name: 1 });
        console.log("Consulta exitosa, devolviendo datos...");
        res.status(200).json(rawMaterials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRawMaterialById = async (req, res) => {
    try {
        const rawMaterial = await RawMaterial.findById(req.params.id);
        if (rawMaterial) {
            res.status(200).json(rawMaterial);
        } else {
            res.status(404).json({ message: 'Materia prima no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRawMaterial = async (req, res) => {
    try {
        const newRawMaterial = new RawMaterial(req.body);
        const savedRawMaterial = await newRawMaterial.save();
        res.status(201).json(savedRawMaterial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRawMaterial = async (req, res) => {
    try {
        const updatedRawMaterial = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedRawMaterial) {
            res.status(200).json(updatedRawMaterial);
        } else {
            res.status(404).json({ message: 'Materia prima no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRawMaterial = async (req, res) => {
    try {
        const deletedRawMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
        if (deletedRawMaterial) {
            res.status(200).json({ message: 'Materia prima eliminada' });
        } else {
            res.status(404).json({ message: 'Materia prima no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const  descontarCantidad = async (req, res)=> {
    const { id } = req.params;
    const { cantidad } = req.params;

    try {
        const materiaPrima = await RawMaterial.findById(id);

        if (!materiaPrima) {
            return res.status(404).json({ mensaje: 'Materia prima no encontrada' });
        }

        if (cantidad < 0) {
            return res.status(400).json({ mensaje: 'La cantidad debe ser mayor o igual a cero' });
        }

        if (cantidad > materiaPrima.cantidad) {
            return res.status(400).json({ mensaje: 'No hay suficiente cantidad de materia prima' });
        }

        // Realiza el descuento de cantidad o restauración según el caso
        if (cantidad > 0) {
            materiaPrima.cantidad -= cantidad;
        } else {
            // Si la cantidad es 0 o negativa, restaura la cantidad
            materiaPrima.cantidad -= cantidad;
        }

        // Guarda los cambios y verifica si la operación es exitosa
        const updatedMateriaPrima = await materiaPrima.save();

        return res.json({ mensaje: 'Operación realizada exitosamente', materiaPrima: updatedMateriaPrima });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
}



// Controlador de Materias Primas (controllers/materiasPrimas.js)



// ...

const buscarPorNombre = async (req, res) => {
    const { nombre } = req.params;

    try {
        const materiasPrimas = await RawMaterial.find({ nombre: new RegExp(nombre, "i") });

        if (!materiasPrimas || materiasPrimas.length === 0) {
            return res.status(404).json({ message: 'Materia Prima no encontrada' });
        }

        res.json(materiasPrimas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al buscar la Materia Prima' });
    }
};

const getRawMaterialsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;  // obtén el número de página del query, o usa 1 por defecto
        const pageSize = 10;  // establece el tamaño de página en 10
        const skip = (page - 1) * pageSize;  // calcula cuántos documentos saltar

        // Obtiene la cantidad total de documentos
        const totalDocuments = await RawMaterial.countDocuments();

        // Calcula la cantidad total de páginas
        const totalPages = Math.ceil(totalDocuments / pageSize);

        // Obtiene los documentos de la página actual

        const rawMaterials = await RawMaterial.find(). sort({ nombre: 1 }).skip(skip).limit(pageSize);


        if (rawMaterials) {
            res.status(200).json({ totalPages, data: rawMaterials });
        } else {
            res.status(404).json({ message: 'No se encontraron materias primas' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    getAllRawMaterials,
    buscarPorNombre,
    getRawMaterialById,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    buscarPorNombre,
    getRawMaterialsPaginated,
    descontarCantidad,
};