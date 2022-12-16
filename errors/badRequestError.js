const { STATUS_CODE } = require('../utils/STATUS_CODE');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = STATUS_CODE.BAD_REQUEST_CODE;
  }
}

module.exports = { BadRequestError };