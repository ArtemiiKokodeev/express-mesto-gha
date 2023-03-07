const {
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

class ApplicationError extends Error {
  constructor(status = INTERNAL_SERVER_ERROR, message = 'Internal Server Error') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationError;
