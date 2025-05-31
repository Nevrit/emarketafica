const User = require('../../../backend/models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new ErrorResponse('Cet email est déjà utilisé', 400));
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new ErrorResponse('Ce nom d\'utilisateur est déjà pris', 400));
  }

  // Créer l'utilisateur
  const user = await User.create({
    username,
    email,
    password,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Valider email & password
  if (!email || !password) {
    return next(new ErrorResponse('Veuillez fournir un email et un mot de passe', 400));
  }

  // Vérifier l'utilisateur
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Identifiants invalides', 401));
  }

  // Vérifier si le mot de passe correspond
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Identifiants invalides', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Déconnexion utilisateur / effacer le cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Obtenir l'utilisateur actuel
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Mettre à jour les détails utilisateur
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username || req.user.username,
    email: req.body.email || req.user.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Obtenir un token à partir du modèle, créer un cookie et envoyer la réponse
const sendTokenResponse = (user, statusCode, res) => {
  // Créer token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Ajouter secure flag en production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Exclure le mot de passe de la réponse
  const userData = {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userData
    });
};