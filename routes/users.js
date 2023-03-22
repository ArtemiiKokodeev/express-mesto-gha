const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const {
  updateUserInfoJoiValidation,
  updateUserAvatarJoiValidation,
} = require('../middlewares/userJoiValidation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfoJoiValidation, updateUserInfo);
router.patch('/me/avatar', updateUserAvatarJoiValidation, updateUserAvatar);

module.exports = router;
