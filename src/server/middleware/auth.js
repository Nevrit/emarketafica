const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protéger les routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifier si le token est dans les headers ou les cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token du header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Prendre le token des cookies
    token = req.cookies.token;
  }

  // Vérifier si le token existe
  if (!token) {
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }
});