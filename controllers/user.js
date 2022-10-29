const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы не корректные данные'});
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка сервера' });
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
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
      else {
    res.status(500).send({ message: 'Неизвестная ошибка сервера' });
  }
});

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы не корректные данные' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы не корректные данные' });
    } else if (err.name === 'CastError') {
      res.status(404).send({ message: 'Пользователь с указанным id не найден' });
    } else {
      res.status(500).send({ message: 'Неизвестная ошибка сервера'});
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};