require('dotenv').config();

const { NODE_ENV, SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};