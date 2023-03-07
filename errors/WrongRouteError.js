const { NOT_FOUND } = require('../utils/constants');

module.exports.wrongRouteHandler = (req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Данной страницы не существует' });
  next();
};
