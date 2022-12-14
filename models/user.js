const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail, isURL } = require('validator');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link) => isURL(link),
      message: 'Некорректный формат URL',
    },
  },
  email: {
    validate: {
      validator(email) {
        return isEmail(email);
      },
      message: 'Некорректный формат email',
    },
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 3,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password, res) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        res.status(401)
          .send({ message: STATUS_MESSAGE.WRONG_LOGIN_DATA_MESSAGE });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.status(401)
              .send({ message: STATUS_MESSAGE.WRONG_LOGIN_DATA_MESSAGE });
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
