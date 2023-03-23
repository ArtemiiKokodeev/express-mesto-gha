const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DataNotFoundError = require('../errors/DataNotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { OK, CREATED } = require('../utils/constants');

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.status(OK).send({ data: user }))
    .catch(next);
};

// GET /users/me - возвращает текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

// POST /signup — создаёт пользователя (регистрация)
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch(next);
};

// POST /signin — авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неправильная почта и пароль');
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      throw new UnauthorizedError('Неправильная почта и пароль');
    }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.status(OK).send({ data: user }))
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.status(OK).send({ data: user }))
    .catch(next);
};
