import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards, getCard, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.get('/:id', getCard);
router.post('/', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .uri(),
    }),
}), createCard);
router.delete('/:id', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
