/**
 * @fileoverview Routes de gestion des catways
 * Gère les opérations CRUD pour la gestion des catways
 * @requires express
 * @requires ../models/catway
 */

const express = require('express');
const router = express.Router();
const Catway = require ('../models/catway')


/**
 * GET / - Récupère et affiche tous les catways
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Affiche le modèle gestioncatways avec la liste des catways
 * @throws {Error} Envoie une erreur 500 si la requête échoue
 */
router.get('/', async (req, res) => {
    try {
        const catways = await Catway.find();
        res.render('gestioncatways', { 
            title: 'Gestion des Catways',
            user: req.session.user, 
            catways : catways
         }); 
    } catch (error) {
        console.error("Erreur", error);
        res.status(500).send("Erreur d'affichage");
    }
});

/**
 * POST / - Crée un nouveau catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {number} req.body.catwayNumber - Le numéro du catway
 * @param {string} req.body.catwayType - Le type de catway
 * @param {string} req.body.catwayState - L'état du catway
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestioncatways en cas de succès
 * @throws {Error} Envoie une erreur 500 si la création échoue
 */
router.post('/', async (req,res) => {
    try {
        console.log("Données reçues du formulaire :", req.body);
        const newCatway = new Catway ({
            catwayNumber: req.body.catwayNumber,
            catwayType: req.body.catwayType,
            catwayState: req.body.catwayState
        });
        await newCatway.save();
        res.redirect ('/gestioncatways')
    } catch (error) {
        console.error("L'ERREUR RÉELLE EST :", error);
        res.status(500).send('Erreur lors de l\'ajout');
    }
});

/**
 * POST /update/:id - Met à jour l'état d'un catway existant
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - L'ID du catway à mettre à jour
 * @param {string} req.body.catwayState - Le nouvel état du catway
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestioncatways en cas de succès
 * @throws {Error} Envoie une erreur 500 si la mise à jour échoue
 */
router.post ('/update/:id', async (req, res) => {
    try {
       const catwayNumber = parseInt(req.params.id);
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: catwayNumber },
            { catwayState: req.body.catwayState },
            { new: true, runValidators: true }
        );
        res.redirect('/gestioncatways')
    } catch (error) {
        console.error('erreur de modification');
        res.status(500).send('Erreur de mise à jour');
    }
})

/**
 * POST /delete/:id - Supprime un catway
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - L'ID du catway à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestioncatways en cas de succès
 * @throws {Error} Envoie une erreur 500 si la suppression échoue
 */
router.post('/delete/:id', async (req,res) => {
    try {
        const catwayNumber = parseInt(req.params.id);
        const catway = await Catway.findOneAndDelete({ 
            catwayNumber: catwayNumber 
        });
        res.redirect('/gestioncatways')
    } catch (error) {
        res.status(500).send('Erreur de suppression');
    }
})

/**
 * Exporte le module routeur
 */
module.exports = router;