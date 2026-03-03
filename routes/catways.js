/**
 * @fileoverview Routes API pour la gestion des catways et réservations
 * Fournit les endpoints pour les opérations CRUD sur les catways et les réservations
 * @requires express
 * @requires ../models/catway
 * @requires ../models/reservations
 */

const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const Reservation = require('../models/reservations');

/**
 * @section Routes Catways
 * Gestion complète des ressources catways
 */


/**
 * GET / - Récupère la liste de tous les catways
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object[]} Tableau JSON de tous les catways
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.get('/', async (req, res) => {
    try {
        const catway = await Catway.find();
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

/**
 * GET /:id - Récupère un catway spécifique par son numéro
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway à récupérer
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet catway trouvé
 * @throws {Error} Erreur 404 si le catway n'existe pas
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.get('/:id', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id});
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

/**
 * POST / - Crée un nouveau catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Données du nouveau catway
 * @param {number} req.body.catwayNumber - Le numéro du catway
 * @param {string} req.body.catwayType - Le type du catway
 * @param {string} req.body.catwayState - L'état du catway
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet catway créé avec statut 201
 * @throws {Error} Erreur 400 si les données sont invalides
 */
router.post('/', async (req, res) => {
    try {
        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du catway', error: error.message });
    }
});

/**
 * PUT /:id - Met à jour l'état d'un catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway à mettre à jour
 * @param {Object} req.body - Données de mise à jour
 * @param {string} req.body.catwayState - Le nouvel état du catway
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet catway mis à jour
 * @throws {Error} Erreur 404 si le catway n'existe pas
 * @throws {Error} Erreur 400 si la mise à jour échoue
 */
router.put('/:id', async (req,res) => {
    try {
        const updates = { catwayState : req.body.catwayState };
        const catway = await Catway.findOneAndUpdate({ catwayNumber: req.params.id }, updates, { new: true, runValidators: true } );
        if (!catway) {
            return res.status(404).json({ message: ' Catway non trouvé '});
        }
        res.json(catway);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la modification', error: error.message});
    }
});

/**
 * DELETE /:id - Supprime un catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Statut 204 en cas de succès
 * @throws {Error} Erreur 404 si le catway n'existe pas
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.delete('/:id', async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id});
        if (!catway) {
            return res.status(404).json({ message: ' Catway non trouvé '});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


/**
 * @section Routes Réservations
 * Gestion des réservations associées aux catways
 */

/**
 * GET /:id/reservations - Récupère toutes les réservations d'un catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway
 * @param {Object} res - Objet de réponse Express
 * @returns {Object[]} Tableau des réservations du catway
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.get('/:id/reservations', async (req, res) => {
    try {
        const reservation = await Reservation.find({catwayNumber: req.params.id});
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

/**
 * GET /:id/reservations/:idReservation - Récupère une réservation spécifique
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway
 * @param {string} req.params.idReservation - L'ID de la réservation à récupérer
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet réservation trouvé
 * @throws {Error} Erreur 404 si la réservation n'existe pas
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.get('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });     
    }
});


/**
 * POST /:id/reservations - Crée une nouvelle réservation pour un catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway
 * @param {Object} req.body - Données de la réservation
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet réservation créé avec statut 201
 * @throws {Error} Erreur 400 si les données sont invalides
 */
router.post('/:id/reservations', async (req, res) => {
    try {
        const reservationData = { ...req.body, catwayNumber: req.params.id };
        const reservation = new Reservation(reservationData);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la réservation', error: error.message});
    }
});


/**
 * PUT /:id/reservations - Met à jour une réservation
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway
 * @param {Object} req.body - Données de mise à jour contenant l'ID de la réservation
 * @param {string} req.body._id - L'ID de la réservation à mettre à jour
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet réservation mis à jour
 * @throws {Error} Erreur 404 si la réservation n'existe pas
 * @throws {Error} Erreur 400 si la mise à jour échoue
 */
router.put('/:id/reservations', async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;
        const reservation = await Reservation.findByIdAndUpdate( _id, updateData, { new: true});
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la modification', error: error.message });     
    }
});


/**
 * DELETE /:id/reservations/:idReservation - Supprime une réservation
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - Le numéro du catway
 * @param {string} req.params.idReservation - L'ID de la réservation à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Statut 204 en cas de succès
 * @throws {Error} Erreur 404 si la réservation n'existe pas
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.delete('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });     
    }
});


/**
 * Exporte le module routeur pour utilisation dans l'application principale
 */
module.exports = router;