const { STATUS_CODE } = require('../utils/STATUS_CODE');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = STATUS_CODE.FORBIDDEN_CODE;
  }
}

module.exports = { ForbiddenError };