const {
  BAD_REQUEST,
} = require('../utils/constants');

class DataValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
    this.name = this.constructor.name;
  }
}

module.exports = DataValidationError;
