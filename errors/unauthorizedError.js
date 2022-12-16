const { STATUS_CODE } = require('../utils/STATUS_CODE');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = STATUS_CODE.NOT_AUTHORIZED_CODE;
  }
}

module.exports = { UnauthorizedError };