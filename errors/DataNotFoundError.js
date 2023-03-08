// const ApplicationError = require('./ApplicationError');
const { NOT_FOUND } = require('../utils/constants');

class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = NOT_FOUND;
    this.name = this.constructor.name;
  }
}

module.exports = DataNotFoundError;
