require('dotenv').config();

const { NODE_ENV, SECRET_KEY } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
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
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        _id: user._id,
        name,
        about,
        avatar,
        email,
      },
    }))
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
        })
        .json({ token })
        .end();
    })
    .catch(next);
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne(req.user)
      .orFail(new NotFoundError(STATUS_MESSAGE.NONEXISTENT_USER_MESSAGE));
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(STATUS_MESSAGE.WRONG_ID_MESSAGE));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar, login, getUserInfo,
};