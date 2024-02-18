import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardRouter from './routes/cards';

export interface CustomRequest extends Request {
  user?: {_id: string};
}

const { PORT = 3000 } = process.env;
const app = express();
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
app.use('/cards', cardRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);
