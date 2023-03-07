const ApplicationError = require('./ApplicationError');
const { NOT_FOUND } = require('../utils/constants');

class DataNotFoundError extends ApplicationError {
  constructor() {
    super(NOT_FOUND, 'Запрашиваемые данные не найдены');
  }
}

module.exports = DataNotFoundError;
