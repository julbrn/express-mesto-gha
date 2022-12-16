require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/user');
const { NOTFOUND_CODE } = require('./utils/STATUS_CODE');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignup, validateSignin } = require('./middlewares/celebrate');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// подключаем rate-limiter
app.use(limiter);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);
app.use(auth);
app.use('/', usersRoute);
app.use('/', cardsRoute);
app.use((req, res) => {
  res.status(NOTFOUND_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
