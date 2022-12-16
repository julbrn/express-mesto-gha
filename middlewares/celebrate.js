const { celebrate, Joi } = require('celebrate');

const validateSignin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .min(3)
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});

const validateSignup = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(/^https?:\/\/(www\.)?[\w\-_~:/#[\]@!&',;=]+\.[\w\-_~:/#[\]@!&',;=а-я]+#?/i),
      email: Joi.string()
        .min(3)
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});

module.exports = {
  validateSignup,
  validateSignin,

};