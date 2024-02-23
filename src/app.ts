import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { celebrate, errors, Joi } from 'celebrate';
import usersRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';

export interface CustomRequest extends Request {
  user?: { _id: string };
}

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
      name: Joi.string(),
      about: Joi.string(),
      avatar: Joi.string(),
    }),
}), createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

app.use((req: Request, res: Response) => {
  res.status(404)
    .json({ message: 'Not Found' });
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
