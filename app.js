const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { createUserJoiValidation, loginJoiValidation } = require('./middlewares/userJoiValidation');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorhandler');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

mongoose.set('strictQuery', false);

const { NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginJoiValidation, login);
app.post('/signup', createUserJoiValidation, createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use(errors());
app.use(errorHandler);

app.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Данной страницы не существует' });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
