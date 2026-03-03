/**
 * @fileoverview Modèle Mongoose pour les catways
 * Définit la structure et la validation des données de catway
 * @requires mongoose
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de catway
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Le numéro unique du catway (obligatoire, unique)
 * @property {string} catwayType - Le type de catway: 'long' ou 'short' (obligatoire)
 * @property {string} catwayState - L'état du catway (obligatoire)
 * @property {Date} createdAt - La date de création (générée automatiquement)
 * @property {Date} updatedAt - La date de mise à jour (générée automatiquement)
 */
const CatwaySchema = new Schema({
    catwayNumber:  {
        type: Number,
        required: [true, 'Le numéro de catway est requis'],
        unique: true
    },
    catwayType:  {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: ['long', 'short']
    },
    catwayState: {
        type: String,
        required: [true, 'L\'état du catway est requis']
    }
}, {
    timestamps: true
});

/**
 * Exporte le modèle Catway
 * @type {Object}
 */
module.exports = mongoose.model('Catway', CatwaySchema);