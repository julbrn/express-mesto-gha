require('dotenv').config();
const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;
const { UnauthorizedError } = require('../errors/unauthorizedError');
const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(STATUS_MESSAGE.UNAUTHORIZED_MESSAGE);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError(STATUS_MESSAGE.UNAUTHORIZED_MESSAGE);
  }

  req.user = payload;

  next();
};