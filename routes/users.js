const user = require('express').Router();
const {
  getUsers,
  getUserById,
  // createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

user.get('/users', getUsers);
user.get('/users/:userId', getUserById);
// user.post('/users', createUser);
user.patch('/users/me', updateProfile);
user.patch('/users/me/avatar', updateAvatar);
module.exports = user;