import { Router } from 'express';
import {
  getCards, getCard, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.get('/:id', getCard);
router.post('/', createCard);
router.delete('/:id', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
