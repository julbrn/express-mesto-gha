require('dotenv').config();

console.log(process.env.DATABASE_LINK);
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
const { NotFoundError } = require('./errors/notFoundError');
const { STATUS_MESSAGE } = require('./utils/STATUS_MESSAGE');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignup, validateSignin } = require('./middlewares/celebrate');

const { PORT = 3000 } = process.env;
const app = express();

// К сожалению, предложенная реализвация не проходит автотесты. Может быть, что-то не делаю.
// Добавила в файл .env переменные
// и доставала их в app.js из process.env. Локально всё работет, а тесты не проходит: "Исправьте
// ошибки в коде:
// 1. URI в файле app.js для подключения к mongodb не найден. Пример правильного URI: mongodb://localhost:27017/mestodb"

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// при добавлении переменных в .env не проходит тесты, не получилось выполнить :(
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use('/', auth, usersRoute);
app.use('/', auth, cardsRoute);

app.use('*', () => {
  throw new NotFoundError(STATUS_MESSAGE.PAGE_NOT_FOUND_MESSAGE);
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
