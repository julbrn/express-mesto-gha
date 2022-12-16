const { STATUS_CODE } = require('../utils/STATUS_CODE');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = STATUS_CODE.NOT_FOUND_CODE;
  }
}

module.exports = { NotFoundError };