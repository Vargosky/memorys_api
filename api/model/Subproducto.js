const { Schema, model } = require("mongoose");

const SubproductoSchema = Schema({
    name: { type: String, required: false },
    category: { type: String, enum: ['Masa', 'Relleno'], required: false },
    ingredients: [
        {
            materiaPrimaId: { type: String },
            quantity: Number,
            
        }
    ],
    preparationTime: { type: Number, required: false },
    cost: { type: Number, required: false },
    shelfLife: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = model("Subproducto", SubproductoSchema, "subproducto");