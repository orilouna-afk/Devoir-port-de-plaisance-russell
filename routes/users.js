/**
 * @fileoverview Routes API pour la gestion des utilisateurs
 * Fournit les endpoints pour les opérations CRUD sur les utilisateurs
 * @requires express
 * @requires ../models/user
 * @requires bcrypt
 */

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

/**
 * GET / - Récupère la liste de tous les utilisateurs
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object[]} Tableau JSON de tous les utilisateurs (sans mots de passe)
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.get('/', async (req, res) =>{
  try {
    const user = await User.find({}, '-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({message : 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /:email - Récupère un utilisateur spécifique par son adresse email
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.email - L'adresse email de l'utilisateur à récupérer
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet utilisateur trouvé (sans mot de passe)
 * @throws {Error} Erreur 404 si l'utilisateur n'existe pas
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({email: req.params.email}, '-password');
    if (!user) return res.status(404).json({message:'Utilisateur introuvable'});
    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Erreur serveur', error: error.message });
  }
});

/**
 * POST / - Crée un nouvel utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Données du formulaire
 * @param {string} req.body.username - Le nom d'utilisateur
 * @param {string} req.body.email - L'adresse email unique
 * @param {string} req.body.password - Le mot de passe (minimum 6 caractères)
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Message de confirmation avec statut 201
 * @throws {Error} Erreur 400 si le mot de passe est trop court
 * @throws {Error} Erreur 400 si la création échoue (email dupliqué, etc.)
 */
router.post('/', async(req, res) => {
  try {
    const { username, email, password } = req.body;
    if (password.length <6 ) {
      return res.status(400).json({message: 'Le mot de passe doit faire au moins 6 caractères'});
    }
    const user = new User({username, email, password});
    await user.save();
    res.status(201).json({message: 'Utilisateur crée avec succès'});
  } catch (error) {
    res.status(400).json({message: 'Erreur de création'});
  }
});

/**
 * PUT /:email - Met à jour les données d'un utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.email - L'adresse email de l'utilisateur à mettre à jour
 * @param {Object} req.body - Données de mise à jour
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Objet utilisateur mis à jour
 * @throws {Error} Erreur 404 si l'utilisateur n'existe pas
 * @throws {Error} Erreur 400 si la mise à jour échoue
 */
router.put('/:email', async(req, res) => {
  try {
    const updates= req.body;
    const user = await User.findOneAndUpdate({email: req.params.email}, updates, {new:true});
    if (!user) return res.status(404).json({message: 'Utilisateur introuvable'});
    res.json(user);
  } catch (error) {
    res.status(400).json({message: 'Erreur lors de la modification'});
  }
});

/**
 * DELETE /:email - Supprime un utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {string} req.params.email - L'adresse email de l'utilisateur à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {void} Statut 204 en cas de succès
 * @throws {Error} Erreur 404 si l'utilisateur n'existe pas
 * @throws {Error} Erreur 500 en cas d'erreur serveur
 */
router.delete('/:email', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

/**
 * Exporte le module routeur 
 */
module.exports = router;
