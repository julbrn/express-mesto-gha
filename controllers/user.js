const mongoose = require('mongoose');
const User = require('../models/user');

const userResponseHandler = (user, res) => {
  user
    ? res.status(200).send({ data: user })
    : res.status(404).send({ message: 'Пользователь с переданным ID не найден' });
}

const serverErrorHandler = (err, res) => {
  err.name === 'CastError' || err.name === 'ValidationError'
    ? res.status(400).send({ message: `Возникла ошибка ${err.message}` })
    : res.status(500).send({ message: `Возникла ошибка ${err.message}` });
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ data: err.message }));
};

const getCurrentUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
    User.findById(req.user._id)
      .then((user) => userResponseHandler(user, res))
      .catch((err) => {
        res.status(500).send({ data: err.message });
      });
  } else {
    res.status(400).send({ message: 'Введен некорректный id' });
  }
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => userResponseHandler(user, res))
    .catch((err) => serverErrorHandler(err, res));
};

const createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => serverErrorHandler(err, res));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => userResponseHandler(user, res))
    .catch((err) => serverErrorHandler(err, res));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => userResponseHandler(user, res))
    .catch((err) => serverErrorHandler(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
};