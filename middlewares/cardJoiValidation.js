const { celebrate, Joi } = require('celebrate');

// проверка url картинки через регулярное выражение:
const regex = /(ftp|http|https):\/\/.(www\.)?[a-z\-\d]+\.[\w\-.~:/?#[\]@!$&'()*+,;=]{1,}#?/i;

// проверка полей при создании карточки
module.exports.createCardJoiValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
});

// проверка _id при удалении карточки, установке или снятии лайка
module.exports.cardIdJoiValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
