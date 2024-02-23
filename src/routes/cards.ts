import { Router } from 'express';
import {
  getCards, getCard, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { validateCreateCard, validateId } from '../middlewares/validation';

const router = Router();

router.get('/', getCards);
router.get('/:id', validateId('id'), getCard);
router.post('/', validateCreateCard('name', 'link'), createCard);
router.delete('/:id', validateId('id'), deleteCard);
router.put('/:cardId/likes', validateId('cardId'), likeCard);
router.delete('/:cardId/likes', validateId('cardId'), dislikeCard);

export default router;
