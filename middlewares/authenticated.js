const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.'});

        }
        return res.redirect('/');
    }
};

module.exports = { isAuthenticated }