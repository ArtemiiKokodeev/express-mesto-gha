const ApplicationError = require('./ApplicationError');
const {
  BAD_REQUEST,
} = require('../utils/constants');

class DataValidationError extends ApplicationError {
  constructor() {
    super(BAD_REQUEST, 'Переданы некорректные данные');
  }
}

module.exports = DataValidationError;
