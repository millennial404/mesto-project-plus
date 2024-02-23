import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import {
  CREATED,
} from '../utils/const';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../middlewares/errors';

export interface CustomRequest extends Request {
  user?: { _id: string };
}

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find();
    return res.send(cards);
  } catch (err: any) {
    return next(err);
  }
};

export const getCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send(card);
  } catch (err: any) {
    return next(err);
  }
};

export const createCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name || !req.body.link) {
      throw new BadRequestError('Недостаточно данных для создания карточки');
    }
    if (!req.user) {
      throw new UnauthorizedError('Пользователь не авторизован');
    }
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user?._id,
    });
    return res.status(CREATED)
      .send(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const badRequestError = new BadRequestError('Ошибка валидации');
      return next(badRequestError);
    }
    return next(err);
  }
};

export const deleteCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (card.owner.toString() !== req.user?._id) {
      throw new ForbiddenError();
    }
    const deletedCard = await Card.findByIdAndRemove(req.params.id);
    return res.send({ message: `Карточка ${deletedCard?.name} удалена` });
  } catch (err: any) {
    return next(err);
  }
};

export const likeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      const badRequestError = new BadRequestError();
      return next(badRequestError);
    }
    return next(err);
  }
};

export const dislikeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      const badRequestError = new BadRequestError();
      return next(badRequestError);
    }
    return next(err);
  }
};
