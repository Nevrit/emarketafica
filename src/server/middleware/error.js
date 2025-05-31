const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log pour le développeur
  console.log(err);

  // Erreur Mongoose - ID incorrect
  if (err.name === 'CastError') {
    const message = `Ressource non trouvée`;
    error = new ErrorResponse(message, 404);
  }

  // Erreur Mongoose - Champs en double
  if (err.code === 11000) {
    const message = 'Valeur de champ en double entrée';
    error = new ErrorResponse(message, 400);
  }

  // Erreur Mongoose - Validation échouée
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur'
  });
};

module.exports = errorHandler;