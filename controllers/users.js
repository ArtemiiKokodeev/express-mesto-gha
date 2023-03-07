const User = require('../models/user');
const DataNotFoundError = require('../errors/DataNotFoundError');
const DataValidationError = require('../errors/DataValidationError');
const {
  OK, CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(
        { message: `Ошибка при получении данных от сервера: ${err.message}` },
      );
    });
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new DataValidationError();
    })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DataValidationError') {
        res.status(err.status).send(
          { message: err.message },
        );
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(
          { message: `Ошибка при получении данных от сервера: ${err.message}` },
        );
      }
    });
};

// POST /users — создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send(
          { message: `Переданы некорректные данные: ${err.message}` },
        );
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(
          { message: `Ошибка при получении данных от сервера: ${err.message}` },
        );
      }
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(BAD_REQUEST).send(
      { message: 'Данные переданы некорректно' },
    );
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new DataNotFoundError();
    })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DataNotFoundError') {
        res.status(err.status).send(
          { message: err.message },
        );
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send(
          { message: `Переданы некорректные данные: ${err.message}` },
        );
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(
          { message: `Ошибка при получении данных от сервера: ${err.message}` },
        );
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(BAD_REQUEST).send(
      { message: 'Данные переданы некорректно' },
    );
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new DataNotFoundError();
    })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DataNotFoundError') {
        res.status(err.status).send(
          { message: err.message },
        );
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send(
          { message: `Переданы некорректные данные: ${err.message}` },
        );
      } else {
        res.status(INTERNAL_SERVER_ERROR).send(
          { message: `Ошибка при получении данных от сервера: ${err.message}` },
        );
      }
    });
};
