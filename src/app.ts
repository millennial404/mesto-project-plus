import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import usersRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';

export interface CustomRequest extends Request {
  user?: {_id: string};
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
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65d0a83ef95e9f09517e6bcc',
  };

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', usersRouter);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/cards', cardRouter);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT);
