const { celebrate, Joi } = require('celebrate');

// проверка полей при создании юзера
module.exports.createCardJoiValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});
