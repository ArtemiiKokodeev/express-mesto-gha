const { celebrate, Joi } = require('celebrate');

// проверка url аватара через регулярное выражение:
const regex = /(ftp|http|https):\/\/.(www\.)?[a-z\-\d]+\.[\w\-.~:/?#[\]@!$&'()*+,;=]{1,}#?/i;

// проверка полей при создании юзера
module.exports.createUserJoiValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
  }),
});

// проверка полей при авторизации
module.exports.loginJoiValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// проверка полей при обновлении профиля
module.exports.updateUserInfoJoiValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// проверка полей при обновлении аватара
module.exports.updateUserAvatarJoiValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regex),
  }),
});

// проверка _id при возврате пользователя
module.exports.userIdJoiValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});
