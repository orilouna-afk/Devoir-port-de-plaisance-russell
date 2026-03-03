/**
 * @fileoverview Modèle Mongoose pour les utilisateurs
 * Définit la structure et la validation des données d'utilisateur avec hashage de mot de passe
 * @requires mongoose
 * @requires bcrypt
 */

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

/**
 * Schéma d'utilisateur
 * @typedef {Object} User
 * @property {string} username - Le nom d'utilisateur unique (obligatoire, trimmé)
 * @property {string} email - L'adresse email unique en minuscules (obligatoire, trimmée)
 * @property {string} password - Le mot de passe hashé (obligatoire, trimmé)
 * @property {Date} createdAt - La date de création (générée automatiquement)
 * @property {Date} updatedAt - La date de mise à jour (générée automatiquement)
 */
const UserSchema = new Schema({
    username: { 
        type    : String,
        trim    : true,
        required: [true, 'Le nom d\'utilisateur est requis'],
        unique  : true 
    },
    email: {
        type     : String,
        trim     : true,
        required : [true, 'L\'email est requis'],
        unique   : true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Le mot de passe est requis'] 
    }
}, {
   timestamps: true
});

/**
 * Hook Mongoose - Exécuté avant la sauvegarde
 * Hache le mot de passe si celui-ci a été modifié
 * @async
 * @listens pre:save
 * @returns {void}
 */
UserSchema.pre('save', async function() {
    const user = this;
    
    if (!user.isModified('password')) {
        return;
    }
    user.password = await bcrypt.hash(user.password, 10);
});

/**
 * Méthode pour comparer le mot de passe candidat avec le mot de passe hashé de l'utilisateur
 * @method comparePassword
 * @async
 * @param {string} candidatePassword - Le mot de passe à vérifier
 * @returns {Promise<boolean>} true si les mots de passe correspondent, false sinon
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Exporte le modèle User
 * @type {Object}
 */
module.exports = mongoose.model('User', UserSchema); 


