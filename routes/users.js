const user = require('express').Router();
const {
  getUsers,
  getUserById,
  getMyInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');
const {
  validateUserId,
  validateProfileUpdate,
  validateAvatarUpdate,
} = require('../middlewares/celebrate');

user.get('/users', getUsers);
user.get('/users/me', getMyInfo);
user.get('/users/:userId', validateUserId, getUserById);
user.patch('/users/me', validateProfileUpdate, updateProfile);
user.patch('/users/me/avatar', validateAvatarUpdate, updateAvatar);
module.exports = user;