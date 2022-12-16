const Card = require('../models/card');
const { NotFoundError } = require('../errors/notFoundError');
const { ForbiddenError } = require('../errors/forbiddenError');
const { BadRequestError } = require('../errors/badRequestError');
const { STATUS_CODE } = require('../utils/STATUS_CODE');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.BAD_REQUEST_CODE);
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(STATUS_MESSAGE.NONEXISTENT_CARD_MESSAGE);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(STATUS_MESSAGE.UNAUTHORIZED_CARD_DELETION_MESSAGE);
      }
      return card.remove()
        .then(() => {
          res.send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError(STATUS_MESSAGE.NONEXISTENT_CARD_MESSAGE))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE);
      } else {
        next(err);
      }
    });
};
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new NotFoundError(STATUS_MESSAGE.NONEXISTENT_CARD_MESSAGE))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(STATUS_MESSAGE.INCORRECT_DATA_MESSAGE);
      } else {
        next(err);
      }
    });
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};