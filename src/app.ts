import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './middlewares/errors';
import { validateCreateUser, validateLogin } from './middlewares/validation';

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

app.post('/signin', validateLogin('email', 'password'), login);

app.post('/signup', validateCreateUser('email', 'password', 'name', 'about', 'avatar'), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
