import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  BAD_REQUEST, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED,
} from './const';

export interface CustomRequest extends Request {
  user?: { _id: string };
}

export const createUser = async (req: Request, res: Response) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const {
    name,
    email,
    about,
    avatar,
  } = req.body;
  try {
    if (!email || !hash) {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    const user = await User.create({
      name,
      email,
      password: hash,
      about,
      avatar,
    });
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
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
      return res.status(NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const updateAvatar = async (req: CustomRequest, res: Response) => {
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
      return res.status(NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      'super-strong-secret',
      { expiresIn: '1d' },
    );
    return res.send({ token });
  } catch (err: any) {
    return res.status(UNAUTHORIZED)
      .send({ message: err.message });
  }
};

export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  const id = req.user?._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch (err: any) {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};
