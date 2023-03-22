const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  createCardJoiValidation,
  cardIdJoiValidation,
} = require('../middlewares/cardJoiValidation');

router.get('/', getCards);
router.post('/', createCardJoiValidation, createCard);
router.delete('/:cardId', cardIdJoiValidation, deleteCard);
router.put('/:cardId/likes', cardIdJoiValidation, likeCard);
router.delete('/:cardId/likes', cardIdJoiValidation, dislikeCard);

module.exports = router;
