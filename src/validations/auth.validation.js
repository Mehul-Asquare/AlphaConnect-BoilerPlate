const Joi = require('joi');
const { password } = require('./custom.validation');

const registerOrLogin = {
  body: Joi.object().keys({
    mobile: Joi.string().required(),
  }),
};

// const register = {
//   body: Joi.object().keys({
//     mobile:Joi.string().required(),
//   }),
// };

// const login = {
//   body: Joi.object().keys({
//     mobile: Joi.string().required(),
//   }),
// };

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  // register,
  registerOrLogin,
  // login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
