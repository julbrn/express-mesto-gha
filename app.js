const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { notFoundController } = require('./controllers/notFoundController');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '635ac0fecfd0173d630aa862',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use('/', usersRoute);
app.use('/', cardsRoute);
app.use('*', notFoundController);
