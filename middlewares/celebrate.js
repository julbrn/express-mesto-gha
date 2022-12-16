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

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
  }),
});

const validateNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUserId,
  validateProfileUpdate,
  validateAvatarUpdate,
  validateNewCard,
  validateCardId,
};