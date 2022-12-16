const { STATUS_MESSAGE } = require('../utils/STATUS_MESSAGE');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? STATUS_MESSAGE.SERVER_ERROR_MESSAGE : message });
  next();
};