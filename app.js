const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const usersRoute = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  req.user = {
    _id: '635ac0fecfd0173d630aa862',
  };
  next();
});

/** Роутинг */
app.use(usersRoute);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
