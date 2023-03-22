const Card = require('../models/card');
const DataNotFoundError = require('../errors/DataNotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { OK, CREATED } = require('../utils/constants');

// GET /cards — возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch(next);
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      // console.log(owner);
      if (req.user._id !== owner) {
        throw new ForbiddenError('Нет доступа к удалению карточки');
      }
      Card.remove(card).then(() => res.status(OK).send({ card }));
    })
    .catch(next);
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.status(OK).send({ data: card }))
    .catch(next);
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new DataNotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.status(OK).send({ data: card }))
    .catch(next);
};
