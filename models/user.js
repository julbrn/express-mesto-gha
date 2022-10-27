const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minLength: [2, 'Минимальное количество букв в имени - 2'],
    maxLength: [30, 'Максимальное количество букв в имени - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minLength: [2, 'Минимальное количество букв в описании - 2'],
    maxLength: [30, 'Минимальное количество букв в описании - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Введите ссылку на аватар'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return v.isURL
      },
      message: 'Некорректный URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
