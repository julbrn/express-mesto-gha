const mongoose = require('mongoose');
const Card = require('../models/card');
const StatusCodes = require('../utils/utils');

const getCards = (req, res) => Card.find({});

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};