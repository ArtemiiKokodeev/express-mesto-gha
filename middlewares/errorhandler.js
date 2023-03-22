const {
  BAD_REQUEST, FORBIDDEN, NOT_UNIQUE, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(NOT_UNIQUE).send(
      { message: `Пользователь с такими данными уже существует: ${err.message}` },
    );
    return;
  } if (err.name === 'UnauthorizedError') {
    res.status(err.statusCode).send(
      { message: err.message },
    );
    return;
  } if (err.name === 'DataNotFoundError') {
    res.status(err.statusCode).send(
      { message: err.message },
    );
    return;
  } if (err.name === 'DataValidationError') {
    res.status(err.statusCode).send(
      { message: err.message },
    );
    return;
  } if (err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send(
      { message: err.message },
    );
    return;
  } if (err.name === 'CastError') {
    res.status(BAD_REQUEST).send(
      { message: `Переданы некорректные данные: ${err.message}` },
    );
    return;
  } if (err.name === 'ForbiddenError') {
    res.status(FORBIDDEN).send(
      { message: err.message },
    );
    return;
  } if (err.code === 500) {
    res.status(INTERNAL_SERVER_ERROR).send(
      { message: `Ошибка при получении данных от сервера: ${err.message}` },
    );
    return;
  }

  next();
};

module.exports = errorHandler;
