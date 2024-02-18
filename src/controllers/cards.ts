import { Request, Response } from 'express';
import Card from '../models/card';
import {
  BAD_REQUEST, FORBIDDEN, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED,
} from './const';

export interface CustomRequest extends Request {
  user?: {_id: string};
}

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    return res.send(cards);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const getCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    return res.send(card);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const createCard = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.body.name || !req.body.link) {
      return res.status(BAD_REQUEST)
        .send({ message: 'Недостаточно данных для создания карточки' });
    }
    if (!req.user) {
      return res.status(UNAUTHORIZED)
        .send({ message: 'Необходима авторизация' });
    }
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user?._id,
    });
    return res.send(card);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const deleteCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    if (card.owner.toString() !== req.user?._id) {
      return res.status(FORBIDDEN)
        .send({ message: 'Нельзя удалять чужие карточки' });
    }
    const deletedCard = await Card.findByIdAndRemove(req.params.id);
    return res.send(`Карточка "${deletedCard?.name}" удалена`);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const likeCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    return res.send(card);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};

export const dislikeCard = async (req: CustomRequest, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }
    return res.send(card);
  } catch {
    return res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' });
  }
};
