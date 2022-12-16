const { STATUS_CODE } = require('../utils/STATUS_CODE');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = STATUS_CODE.SERVER_ERROR_CODE;
  }
}

module.exports = { ServerError };