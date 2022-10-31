const User = require('../models/user');
const { NotFoundError } = require('../errors/notFoundError');
const {
  SERVER_ERROR_MESSAGE,
  INCORRECT_DATA_MESSAGE,
  SERVER_ERROR_CODE,
  INCORRECT_DATA_CODE,
  NOTFOUND_CODE,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOTFOUND_CODE).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_CODE).send({ message: INCORRECT_DATA_MESSAGE });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_CODE).send({ message: INCORRECT_DATA_MESSAGE });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
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
        res.status(INCORRECT_DATA_CODE).send({ message: INCORRECT_DATA_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(NOTFOUND_CODE).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
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
        res.status(INCORRECT_DATA_CODE).send({ message: INCORRECT_DATA_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(NOTFOUND_CODE).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};