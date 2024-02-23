import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  BAD_REQUEST,
} from './const';
import { ConflictError, NotFoundError, UnauthorizedError } from '../middlewares/errors';

export interface CustomRequest extends Request {
  user?: { _id: string };
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const {
    name,
    email,
    about,
    avatar,
  } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password: hash,
      about,
      avatar,
    });
    return res.send(user);
  } catch (err: any) {
    if (err.code === 11000) {
      const conflictError = new ConflictError();
      return next(conflictError);
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return next(err);
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err: any) {
    return next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return next(err);
  }
};

export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const {
    name,
    about,
  } = req.body;
  try {
    if (!name || !about) {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }

    const user = await User.findByIdAndUpdate(id, {
      name,
      about,
    }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return next(err);
  }
};

export const updateAvatar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { avatar } = req.body;
  try {
    if (!avatar) {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    const user = await User.findByIdAndUpdate(id, { avatar }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password,
  } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new UnauthorizedError();
    }
    const token = jwt.sign(
      { _id: user._id },
      'super-strong-secret',
      { expiresIn: '1d' },
    );
    return res.send({ token });
  } catch (err: any) {
    return next(err);
  }
};

export const getCurrentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  } catch (err: any) {
    return next(err);
  }
};
