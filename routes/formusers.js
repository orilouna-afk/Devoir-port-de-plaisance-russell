/**
 * @fileoverview Routes de gestion des utilisateurs
 * Gère les opérations CRUD pour la gestion des utilisateurs
 * @requires express
 * @requires ../models/user
 */

const express = require('express');
const router = express.Router();
const User = require('../models/user');



/**
 * GET / - Récupère et affiche tous les utilisateurs
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Affiche le modèle gestionusers avec la liste des utilisateurs
 * @throws {Error} Envoie une erreur 500 si le chargement échoue
 */
router.get ('/', async (req,res) => {
    try {
        const users = await User.find();
        res.render('gestionusers', {
            title: 'Gestion des utilisateurs',
            user: req.session.user,
            users: users
        })
    } catch (error) {
        console.error('Erreur de chargement', error);
        res.status(500).send('Erreur d\'affichage'); 
    }
});

/**
 * POST / - Crée un nouveau utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Données du formulaire
 * @param {string} req.body.username - Le nom d'utilisateur
 * @param {string} req.body.email - L'adresse email de l'utilisateur
 * @param {string} req.body.password - Le mot de passe de l'utilisateur
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestionusers en cas de succès
 * @throws {Error} Envoie une erreur 500 si la création échoue
 */
router.post ('/', async (req,res) => {
    try {
        const newUser = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        await newUser.save();
        res.redirect ('/gestionusers');
    } catch (error) {
        console.error("L'ERREUR RÉELLE EST :", error);
        res.status(500).send('Erreur lors de l\'ajout');
    }
});


/**
 * POST /update/:id - Met à jour les données d'un utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - L'ID MongoDB de l'utilisateur à mettre à jour
 * @param {Object} req.body - Données de mise à jour
 * @param {string} req.body.username - Le nouveau nom d'utilisateur
 * @param {string} req.body.email - La nouvelle adresse email
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestionusers en cas de succès
 * @throws {Error} Envoie une erreur 500 si la mise à jour échoue
 */
router.post ('/update/:id', async (req,res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
          username: req.body.username,
          email: req.body.email,
        })
        res.redirect ('/gestionusers');
    } catch (error) {
        console.error('erreur de modification');
        res.status(500).send('Erreur de mise à jour');
    }
});

/**
 * POST /delete/:id - Supprime un utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.id - L'ID MongoDB de l'utilisateur à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Redirige vers /gestionusers en cas de succès
 * @throws {Error} Envoie une erreur 500 si la suppression échoue
 */
router.post ('/delete/:id', async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect ('/gestionusers');
    } catch (error) {
       console.error(error);
        res.status(500).send("Erreur lors de la suppression "); 
    }
});

/**
 * Exporte le module routeur
 */
module.exports = router; 
