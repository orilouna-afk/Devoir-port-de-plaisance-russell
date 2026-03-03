require('dotenv').config({ path: './env/.env.dev' });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cookieSession = require('cookie-session');
var logger = require('morgan');
var session = require('express-session');



//connexion mongo
const { initClientDbConnection } = require('./mongo');
initClientDbConnection();

//middleware d'authentification 
var { isAuthenticated } = require('./middlewares/authenticated');

//routeurs
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catwaysRouter = require('./routes/catways');
var formcatwaysRouter = require('./routes/formcatways');
var formreservationRouter = require('./routes/formreservation');
var formusersRouter = require('./routes/formusers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
  name: 'session',
  keys: ['key'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Configuration de la session pour l'authentification 
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware pour rendre l'utilisateur disponible dans les vues (res.locals.user)
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/documentation', express.static(path.join(__dirname, 'docs')));

app.use('/', indexRouter);

// routes API (protégées)
app.use('/api/users', isAuthenticated, usersRouter);
app.use('/api/catways', isAuthenticated, catwaysRouter);

//routes formulaires
app.use('/gestioncatways', formcatwaysRouter);
app.use('/gestionreservation', formreservationRouter);
app.use('/gestionusers', formusersRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
