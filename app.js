require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/user');
const { NOTFOUND_CODE } = require('./utils/STATUS_CODE');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '635ac0fecfd0173d630aa862',
//   };
//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', usersRoute);
app.use('/', cardsRoute);
app.use((req, res) => {
  res.status(NOTFOUND_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
