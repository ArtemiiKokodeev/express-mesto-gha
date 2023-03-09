// const ApplicationError = require('./ApplicationError');
const { NOT_FOUND } = require('../utils/constants');

class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DataNotFoundError;
