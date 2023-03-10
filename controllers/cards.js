const Card = require('../models/card');
const DataNotFoundError = require('../errors/DataNotFoundError');
const {
  OK, CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

// GET /cards — возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send(
        { message: `Ошибка при получении данных от сервера: ${err.message}` },
      );
    });
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
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

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.status(OK).send({ data: card, message: 'Карточка успешно удалена' }))
    .catch((err) => {
      if (err.name === 'DataNotFoundError') {
        res.status(err.statusCode).send(
          { message: err.message },
        );
      } else if (err.name === 'CastError') {
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

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемая карточка не найдена');
    })
    .populate('owner')
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DataNotFoundError') {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
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

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемая карточка не найдена');
    })
    .populate(['owner', 'likes'])
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DataNotFoundError') {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
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
