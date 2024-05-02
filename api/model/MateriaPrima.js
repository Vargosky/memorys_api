const { number } = require("joi");
const { Schema, model } = require("mongoose");

const MateriaPrimaSchema = Schema({
    nombre: { 
        type: String, 
        required: true },

    unidad: { 
        type: String, 
        required: true },

    cantidad: { 
        type: Number, 
        default: 0,    
    },

    costoPorUnidad: { 
        type: Number, 
         },

    proveedor: {
            type: String, 
             },

    fechaExpiracion: {
            Type:Date,
            
        },

    creadoDate: { 
        type: Date, 
        default: Date.now },

    updatedDate: { 
        type: Date, 
        default: Date.now },

    stockCritico:{
        type: Number,
        
    }
});

module.exports = model("MateriaPrima", MateriaPrimaSchema, "materiaPrima");