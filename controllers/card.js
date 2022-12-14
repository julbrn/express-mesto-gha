const Card = require('../models/card');
const { NotFoundError } = require('../errors/notFoundError');
const { STATUS_CODE } = require('../utils/STATUS_CODE');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(STATUS_CODE.SERVER_ERROR_CODE)
    .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE }));

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((cards) => res.send(cards))
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError())
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.NOTFOUND_CODE)
          .send({ message: STATUS_MESSAGE.NONEXISTENT_CARD_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError())
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.NOTFOUND_CODE)
          .send({ message: STATUS_MESSAGE.NONEXISTENT_CARD_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError())
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.NOTFOUND_CODE)
          .send({ message: STATUS_MESSAGE.NONEXISTENT_CARD_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.INCORRECT_DATA_CODE)
          .send({ message: STATUS_MESSAGE.INCORRECT_DATA_MESSAGE });
      } else {
        res.status(STATUS_CODE.SERVER_ERROR_CODE)
          .send({ message: STATUS_MESSAGE.SERVER_ERROR_MESSAGE });
      }
    });
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};