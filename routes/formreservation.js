/**
 * @fileoverview Routes de gestion des réservations
 * Gère les opérations CRUD pour la gestion des réservations
 * @requires express
 * @requires ../models/reservations
 */

const express = require('express');
const router = express.Router();
const Reservation = require ('../models/reservations');

/**
 * GET / - Récupère et affiche toutes les réservations
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Affiche le modèle gestionreservation avec la liste des réservations
 * @throws {Error} Envoie une erreur 500 si le chargement échoue
 */
router.get('/', async (req,res) => {
    try {
        const reservation = await Reservation.find();
        res.render('gestionreservation', { 
            title : 'Gestion des réservations',
            user : req.session.user, 
            reservation : reservation 
        });
    } catch (error) {
        console.error('Erreur de chargement', error);
        res.status(500).send('Erreur d\'affichage');   
    }
});

/**
 * POST / - Crée une nouvelle réservation
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Données du formulaire
 * @param {number} req.body.catwayNumber - Le numéro du catway
 * @param {string} req.body.clientName - Le nom du client
 * @param {string} req.body.boatName - Le nom du bateau
 * @param {string} req.body.startDate - La date de début de réservation
 * @param {string} req.body.endDate - La date de fin de réservation
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestionreservation en cas de succès
 * @throws {Error} Envoie une erreur 500 si la création échoue
 */
router.post('/', async (req,res) => {
    try {
        const newReservation = new Reservation ({
            catwayNumber: req.body.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        await newReservation.save();
        res.redirect('/gestionreservation');
    } catch (error) {
        console.error('Erreur',error);
        res.status(500).send('Erreur d\'affichage');
    }
});

/**
 * POST /update/:id - Met à jour une réservation existante
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - L'ID MongoDB de la réservation à mettre à jour
 * @param {Object} req.body - Données de mise à jour
 * @param {string} req.body.clientName - Le nouveau nom du client
 * @param {string} req.body.boatName - Le nouveau nom du bateau
 * @param {string} req.body.startDate - La nouvelle date de début
 * @param {string} req.body.endDate - La nouvelle date de fin
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestionreservation en cas de succès
 * @throws {Error} Envoie une erreur 500 si la mise à jour échoue
 */
router.post('/update/:id', async (req,res) => {
    try {
        await Reservation.findByIdAndUpdate(req.params.id, {
            clientName: req.body.clientName,
            boatName: req.body.boatName, 
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        res.redirect('/gestionreservation');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la modification ");
    }
});

/**
 * POST /delete/:id - Supprime une réservation
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - L'ID MongoDB de la réservation à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestionreservation en cas de succès
 * @throws {Error} Envoie une erreur 500 si la suppression échoue
 */
router.post('/delete/:id', async (req,res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/gestionreservation');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression ");
    }

});
/**
 * Exporte le module routeur pour utilisation dans l'application principale
 */
module.exports = router; 