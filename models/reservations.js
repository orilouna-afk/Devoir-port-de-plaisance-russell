/**
 * @fileoverview Modèle Mongoose pour les réservations
 * Définit la structure et la validation des données de réservation
 * @requires mongoose
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de réservation
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Le numéro du catway réservé (obligatoire, référence à Catway)
 * @property {string} clientName - Le nom du client qui fait la réservation (obligatoire)
 * @property {string} boatName - Le nom du bateau réservé (obligatoire)
 * @property {Date} startDate - La date de début de la réservation (obligatoire)
 * @property {Date} endDate - La date de fin de la réservation (obligatoire)
 * @property {Date} createdAt - La date de création (générée automatiquement)
 * @property {Date} updatedAt - La date de mise à jour (générée automatiquement)
 */
const ReservationSchema = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro de catway est requis pour la réservation'],
        ref: 'Catway'
    },
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise']
    }
}, {
    timestamps: true
});

/**
 * Exporte le modèle Reservation
 * @type {Object}
 */
module.exports = mongoose.model('Reservation', ReservationSchema);