const {
  BAD_REQUEST, NOT_UNIQUE, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send(
      { message: err.message },
    );
    return;
  } if (err.code === 11000) {
    res.status(NOT_UNIQUE).send(
      { message: `Пользователь с такими данными уже существует: ${err.message}` },
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
  }

  res.status(INTERNAL_SERVER_ERROR).send(
    { message: `Ошибка при получении данных от сервера: ${err.message}` },
  );

  next();
};

module.exports = errorHandler;
