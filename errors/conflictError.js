const { STATUS_CODE } = require('../utils/STATUS_CODE');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = STATUS_CODE.CONFLICT_CODE;
  }
}

module.exports = { ConflictError };