const User = require('../models/user');
const { NotFoundError } = require('../errors/notFoundError');
const { STATUS_CODE } = require('../utils/STATUS_CODE');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(STATUS_CODE.SERVER_ERROR_CODE)
      .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE }));
};
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.NOTFOUND_CODE).send({
          message: 'Пользователь с указанным id не'
            + ' найден.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.NOTFOUND_CODE).send({
          message: 'Пользователь с указанным id не'
            + ' найден',
        });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.NOTFOUND_CODE)
          .send({
            message: 'Пользователь с указанным id не'
              + ' найден',
          });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};